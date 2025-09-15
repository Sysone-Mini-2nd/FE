import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let subscriptions = new Map();

// 구독 대기 큐
let subscriptionQueue = [];
let isConnected = false;

// WebSocket 연결 상태 추적
const setConnected = (connected) => {
    isConnected = connected;
    if (connected) {
        // 연결 완료 시 큐에 있는 구독들 처리
        subscriptionQueue.forEach(({ destination, callback, resolve, reject }) => {
            try {
                const subscription = performSubscribe(destination, callback);
                resolve(subscription);
            } catch (error) {
                reject(error);
            }
        });
        subscriptionQueue = [];
    }
};

// 실제 구독 수행 함수
const performSubscribe = (destination, callback) => {
    // 동일한 주소에 대한 중복 구독 방지 (기존 구독 해지 후 재구독)
    if (subscriptions.has(destination)) {
        subscriptions.get(destination).unsubscribe();
        subscriptions.delete(destination);
    }

    const subscription = stompClient.subscribe(destination, (message) => {
        callback(JSON.parse(message.body));
    });
    subscriptions.set(destination, subscription);
    return subscription;
};

const BASE_URL = window.location.hostname === "localhost"
  ? "https://localhost:8081/ws/chat"
  : "https://api.sysonetaskmanager.store/ws/chat";

// WebSocket 연결
export const connectWebSocket = (onConnected) => {
    if (stompClient && stompClient.active) {
        console.log('WebSocket is already connected.');
        setConnected(true);
        if (onConnected) onConnected();
        return;
    }

    stompClient = new Client({
        webSocketFactory: () => new SockJS(BASE_URL),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
            console.log('WebSocket connected!');
            setConnected(true);
            // 연결 성공 후, 콜백 실행
            if (onConnected) onConnected();
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
            setConnected(false);
        },
        // 연결 끊김 시 재연결 시도
        onDisconnect: (frame) => {
            console.log('WebSocket disconnected:', frame);
            setConnected(false);
            // 필요한 경우 재연결 로직 추가
        },
    });
    stompClient.activate();
};

// WebSocket 연결 해제
export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
        subscriptions.clear();
        console.log('WebSocket disconnected!');
    }
};

export const subscribe = (destination, callback) => {
    return new Promise((resolve, reject) => {
        if (isConnected && stompClient && stompClient.active) {
            // 이미 연결되어 있으면 바로 구독
            try {
                const subscription = performSubscribe(destination, callback);
                resolve(subscription);
            } catch (error) {
                reject(error);
            }
        } else {
            // 연결이 안 되어 있으면 큐에 저장
            console.warn('STOMP client is not connected. Queueing subscription for ', destination);
            subscriptionQueue.push({ destination, callback, resolve, reject });
        }
    });
}

// 특정 채팅방 토픽 구독
export const subscribeToChatRoom = (chatRoomId, onMessageReceived) => {
    return subscribe(`/topic/chatroom/${chatRoomId}`, onMessageReceived);
};

// 개인 알림 큐 구독
export const subscribeToUserQueue = (queueName, onNotificationReceived) => {
    return subscribe(`/user/queue/${queueName}`, onNotificationReceived);
};

// 구독 해지
export const unsubscribe = (destination) => {
    if (subscriptions.has(destination)) {
        subscriptions.get(destination).unsubscribe();
        subscriptions.delete(destination);
    }
}

// 메시지 전송 (발행)
export const sendMessage = (chatMessage) => {
    if (stompClient && stompClient.active) {
        stompClient.publish({
            destination: '/app/send',
            body: JSON.stringify(chatMessage),
        });
    } else {
        console.error('Cannot send message, STOMP client is not connected.');
    }
};