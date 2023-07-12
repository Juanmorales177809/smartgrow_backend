#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "esp_wifi.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "driver/gpio.h"
#include "protocol_examples_common.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"

#include "esp_log.h"
#include "mqtt_client.h"

int32_t entrada_de_agua_hidroponico = 1, desague_hidroponico = 1, recirculacion_hidroponico = 1, moto_bomba_hidroponico = 0;

#define ENTRADA_HIDROPONICO 14
#define DESAGUE_HIDROPONICO 27
#define RECIRCULACION_HIDROPONICO 26
#define MOTO_BOMBA 25

static const char *TAG = "MQTT_EXAMPLE";

static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
{
    ESP_LOGD(TAG, "Event dispatched from event loop base=%s, event_id=%" PRIi32 "", base, event_id);
    esp_mqtt_event_handle_t event = event_data;
    esp_mqtt_client_handle_t client = event->client;
    int msg_id = 0;
    switch ((esp_mqtt_event_id_t)event_id)
    {
    case MQTT_EVENT_CONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
        esp_mqtt_client_subscribe(client, "smartgrow/hidroponico/actuadores", 0);
        ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);
        // msg_id = esp_mqtt_client_unsubscribe(client, "/topic/qos1");
        // ESP_LOGI(TAG, "sent unsubscribe successful, msg_id=%d", msg_id);
        break;
    case MQTT_EVENT_DISCONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
        break;
    case MQTT_EVENT_SUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
        msg_id = esp_mqtt_client_publish(client, "/topic/qos0", "data", 0, 0, 0);
        ESP_LOGI(TAG, "sent publish successful, msg_id=%d", msg_id);
        break;
    case MQTT_EVENT_UNSUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
        break;
    case MQTT_EVENT_PUBLISHED:
        ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
        break;
    case MQTT_EVENT_DATA:
        ESP_LOGI(TAG, "MQTT_EVENT_DATA");
        printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
        printf("DATA=%.*s\r\n", event->data_len, event->data);
        char DATA[64], res[64];
        sprintf(DATA, "%.*s", event->data_len, event->data);
        if (strcmp(DATA, "entrada_de_agua_hidroponico") == 0)
        {
            entrada_de_agua_hidroponico = !entrada_de_agua_hidroponico;
            gpio_set_level(ENTRADA_HIDROPONICO, entrada_de_agua_hidroponico);
        }
        else if (strcmp(DATA, "desague_hidroponico") == 0)
        {
            desague_hidroponico = !desague_hidroponico;
            if (!desague_hidroponico)
            {
                recirculacion_hidroponico = 1;
                moto_bomba_hidroponico = 1;
                gpio_set_level(RECIRCULACION_HIDROPONICO, recirculacion_hidroponico);
                gpio_set_level(DESAGUE_HIDROPONICO, desague_hidroponico);
                gpio_set_level(MOTO_BOMBA, moto_bomba_hidroponico);
            }
            else
            {
                gpio_set_level(DESAGUE_HIDROPONICO, desague_hidroponico);
                moto_bomba_hidroponico = 0;
                gpio_set_level(MOTO_BOMBA, moto_bomba_hidroponico);
            }
        }
        else if (strcmp(DATA, "recirculacion_hidroponico") == 0)
        {
            printf("Recirculacion\r\n");
            recirculacion_hidroponico = !recirculacion_hidroponico;
            if (!recirculacion_hidroponico)
            {
                printf("Recirculacion activada");
                desague_hidroponico = 1;
                moto_bomba_hidroponico = 1;
                gpio_set_level(DESAGUE_HIDROPONICO, desague_hidroponico);
                gpio_set_level(RECIRCULACION_HIDROPONICO, recirculacion_hidroponico);
                gpio_set_level(MOTO_BOMBA, moto_bomba_hidroponico);
            }
            else
            {
                printf("Recirculacion desactivada");
                gpio_set_level(RECIRCULACION_HIDROPONICO, recirculacion_hidroponico);
                moto_bomba_hidroponico = 0;
                gpio_set_level(MOTO_BOMBA, moto_bomba_hidroponico);
            }
        }
        else
        {
            printf("No se reconoce el dato");
        }
        sprintf(res, "Entrada: %d, Desague: %d, Recirculacion: %d Moto Bomba: %d", !entrada_de_agua_hidroponico, !desague_hidroponico, !recirculacion_hidroponico, moto_bomba_hidroponico);
        esp_mqtt_client_publish(client, "smartgrow/hidroponico/actuadores/estado", res, 0, 0, 0);
        ESP_LOGI(TAG, "sent publish successful, msg_id=%d", msg_id);
        break;
    case MQTT_EVENT_ERROR:
        ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
        break;
    default:
        ESP_LOGI(TAG, "Other event id:%d", event->event_id);
        break;
    }
}

static void mqtt_app_start(void)
{
    esp_mqtt_client_config_t mqtt_cfg = {
        .uri = CONFIG_BROKER_URL,
    };
    esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
    esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, NULL);
    esp_mqtt_client_start(client);
}

void app_main(void)
{
    gpio_reset_pin(ENTRADA_HIDROPONICO);
    gpio_reset_pin(DESAGUE_HIDROPONICO);
    gpio_reset_pin(RECIRCULACION_HIDROPONICO);
    gpio_reset_pin(MOTO_BOMBA);

    gpio_set_direction(ENTRADA_HIDROPONICO, GPIO_MODE_OUTPUT);
    gpio_set_direction(DESAGUE_HIDROPONICO, GPIO_MODE_OUTPUT);
    gpio_set_direction(RECIRCULACION_HIDROPONICO, GPIO_MODE_OUTPUT);
    gpio_set_direction(MOTO_BOMBA, GPIO_MODE_OUTPUT);

    gpio_set_level(ENTRADA_HIDROPONICO, 1);
    gpio_set_level(DESAGUE_HIDROPONICO, 1);
    gpio_set_level(RECIRCULACION_HIDROPONICO, 1);
    gpio_set_level(MOTO_BOMBA, 0);

    ESP_LOGI(TAG, "[APP] Startup..");
    ESP_LOGI(TAG, "[APP] Free memory: %" PRIu32 " bytes", esp_get_free_heap_size());
    ESP_LOGI(TAG, "[APP] IDF version: %s", esp_get_idf_version());

    esp_log_level_set("*", ESP_LOG_INFO);
    esp_log_level_set("mqtt_client", ESP_LOG_VERBOSE);
    esp_log_level_set("MQTT_EXAMPLE", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT_BASE", ESP_LOG_VERBOSE);
    esp_log_level_set("esp-tls", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT", ESP_LOG_VERBOSE);
    esp_log_level_set("outbox", ESP_LOG_VERBOSE);

    ESP_ERROR_CHECK(nvs_flash_init());
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    ESP_ERROR_CHECK(example_connect());

    esp_netif_ip_info_t ip_info;
    esp_netif_t *netif = NULL;
    netif = esp_netif_get_handle_from_ifkey("WIFI_STA_DEF");

    if (netif == NULL)
    {
        printf("Error al obtener la interfaz de red\n");
    }
    else
    {
        esp_netif_get_ip_info(netif, &ip_info);
        printf("IP: %d.%d.%d.%d\n", IP2STR(&ip_info.ip));
        mqtt_app_start();
    }
}