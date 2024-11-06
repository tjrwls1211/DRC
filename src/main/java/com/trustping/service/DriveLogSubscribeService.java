package com.trustping.service;

import java.nio.charset.StandardCharsets;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.trustping.DTO.DriveLogReceiveDTO;
import com.trustping.config.EnvConfig;
import com.trustping.entity.DriveLog;

import jakarta.annotation.PostConstruct;

@Service
public class DriveLogSubscribeService implements MqttCallback {

    @Autowired
    @Qualifier("driveLogMqttClient")
    private MqttClient driveLogMqttClient; // 구성에서 mqttclient 받아옴
    
    @Autowired
    private EnvConfig envConfig; // 구독 토픽도 가져옴
    
    @Autowired
    private DriveLogStorageService driveLogStorageService;
    
    @Autowired
    private DriveScoreService driveScoreService;
    
    @PostConstruct
    public void subscribeToTopic() {
        String mqttTopic = envConfig.getMqttPedalTopic();
        if (driveLogMqttClient == null) {
            System.out.println("MQTT 연결 불가, 클라이언트가 null");
            return;
        }

        try {
        	driveLogMqttClient.setCallback(this);
            if (driveLogMqttClient.isConnected()) {
            	driveLogMqttClient.subscribe(mqttTopic);
                System.out.println("Subscribed to topic: " + mqttTopic);
            } else {
                System.out.println("MQTT 연결 불가");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    @Override
    public void connectionLost(Throwable cause) {
        System.out.println("Connection lost! " + cause.getMessage());
        reconnect();
    }

    private void reconnect() {
        int retryCount = 0;
        int backoffTime = 2000;

        while (retryCount < 5) { 
            try {
                System.out.println("Attempting to reconnect");
                driveLogMqttClient.connect(); 
                String mqttTopic = envConfig.getMqttPedalTopic();
                driveLogMqttClient.subscribe(mqttTopic); 
                System.out.println("Reconnected and subscribed to topic: " + mqttTopic);
                return; 
            } catch (MqttException e) {
                System.out.println("Reconnection attempt failed: " + e.getMessage());
                retryCount++;
                try {
                    Thread.sleep(backoffTime); 
                    backoffTime *= 2; 
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
        System.out.println("Failed to reconnect after 5 attempts.");
    }

    
    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
    	String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
        System.out.println("Message received on topic " + topic + ": " + payload);
        
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		DriveLogReceiveDTO ReceiveDriveLog = objectMapper.readValue(payload, DriveLogReceiveDTO.class);
		driveLogStorageService.saveData(ReceiveDriveLog);
    }
    
    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
        // 전송은 안해서 구현 필요 없음
    }
}
