package com.casino.project.service;

import com.casino.project.model.Room;
import com.casino.project.model.User;
import com.casino.project.repository.RoomRepository;
import com.casino.project.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public RoomService(RoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Room createRoom(String roomName, int capacity) {
        Room room = new Room();
        room.setName(roomName);
        room.setCapacity(capacity);
        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(Long roomId, String roomName, int capacity) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("No room found with id " + roomId));
        room.setName(roomName);
        room.setCapacity(capacity);
        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("No room found with id " + roomId));
        roomRepository.delete(room);
    }

    @Transactional
    public void joinRoom(Long userId, Long roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("No room found with id " + roomId));
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("No player found with id " + userId));

        user.setCurrentRoom(room);
    }
}
