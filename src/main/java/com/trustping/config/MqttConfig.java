package com.trustping.config;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttConfig {

    private static final String MQTT_BROKER_URL = "tcp://182.231.176.133:1222"; // Mosquitto 브로커 URL
    private static final String CLIENT_ID = "DRC_client"; // 클라이언트 ID
    //private static final String USERNAME = "your-username"; // 필요 시 사용
    //private static final String PASSWORD = "your-password"; // 필요 시 사용

    @Bean
    public MqttClient mqttClient() throws MqttException {
        MqttClient mqttClient = new MqttClient(MQTT_BROKER_URL, CLIENT_ID, new MemoryPersistence());
        MqttConnectOptions options = new MqttConnectOptions();
        options.setCleanSession(true);
        options.setAutomaticReconnect(true);
        //options.setUserName(USERNAME);
        //options.setPassword(PASSWORD.toCharArray());
        mqttClient.connect(options);
        return mqttClient;
    }
}
