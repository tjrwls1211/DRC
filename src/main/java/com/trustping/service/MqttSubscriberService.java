package com.trustping.service;

import java.nio.charset.StandardCharsets;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class MqttSubscriberService implements MqttCallback {

    private static final String MQTT_TOPIC = "pedal"; // 구독할 MQTT 주제

    @Autowired
    private MqttClient mqttClient; // 구성에서 mqttclient 받아옴
    
    @Autowired
    private PedalLogSaveService pedalLogService; // 메시지 전달을 위해 연결
    
    @PostConstruct
    public void subscribeToTopic() {
        try {
            mqttClient.setCallback(this);
            mqttClient.subscribe(MQTT_TOPIC);
            System.out.println("Subscribed to topic: " + MQTT_TOPIC);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void connectionLost(Throwable cause) {
        System.out.println("Connection lost! " + cause.getMessage());
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
    	String payload = new String(message.getPayload(), StandardCharsets.UTF_8);
        System.out.println("Message received on topic " + topic + ": " + payload);
        
        pedalLogService.saveMessage(payload);
    }
    
    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
        // 전송은 안해서 구현 필요 없음
    }
}
