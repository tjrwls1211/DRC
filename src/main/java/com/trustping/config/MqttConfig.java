package com.trustping.config;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttConfig {

    @Autowired
    private EnvConfig envConfig;

    @Bean
    public MqttClient mqttClient() {
        String mqttBrokerUrl = envConfig.getMqttBrokerUrl();
        String mqttClientId = envConfig.getMqttClientId();
        
        MqttClient mqttClient = null;
        try {
            mqttClient = new MqttClient(mqttBrokerUrl, mqttClientId, new MemoryPersistence());
            MqttConnectOptions options = new MqttConnectOptions();
            options.setCleanSession(true);
            options.setAutomaticReconnect(true);
            // 필요 시 사용자 인증 정보 설정
            // options.setUserName(envConfig.getMqttUserName());
            // options.setPassword(envConfig.getMqttUserPassword().toCharArray());
            mqttClient.connect(options);
        } catch (MqttException e) {
            System.err.println("MQTT Client connection failed: " + e.getMessage());
        }
        
        return mqttClient; 
    }
}
