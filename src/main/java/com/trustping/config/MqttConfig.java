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
	
    //private static final String USERNAME = "your-username"; // 필요 시 사용
    //private static final String PASSWORD = "your-password"; // 필요 시 사용

    @Bean
    public MqttClient mqttClient() throws MqttException {
    	String mqttBrokerUrl = envConfig.getMqttBrokerUrl();
    	String mqttClientId = envConfig.getMqttClientId();
    	String userName = envConfig.getMqttUserName();
    	String userPassword = envConfig.getMqttUserPassword();
    	MqttClient mqttClient = new MqttClient(mqttBrokerUrl, mqttClientId, new MemoryPersistence());
        MqttConnectOptions options = new MqttConnectOptions();
        options.setCleanSession(true);
        options.setAutomaticReconnect(true);
        //options.setUserName(USERNAME);
        //options.setPassword(PASSWORD.toCharArray());
        mqttClient.connect(options);
        return mqttClient;
    }
}
