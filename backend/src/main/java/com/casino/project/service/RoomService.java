package com.casino.project.service;

import com.casino.project.dto.room.RoomCreateRequest;
import com.casino.project.dto.room.RoomResponse;
import com.casino.project.dto.room.RoomUpdateRequest;
import com.casino.project.model.Room;
import com.casino.project.model.User;
import com.casino.project.repository.RoomRepository;
import com.casino.project.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public RoomService(RoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RoomResponse createRoom(RoomCreateRequest request, String username) {
        Room room = new Room();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("No player found with username " + username));
        room.setName(request.name());
        room.setCapacity(request.capacity());
        room.setOwner(user);
        Room savedRoom = roomRepository.save(room);
        return mapToResponse(savedRoom);
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("No room found with id: " + roomId));
        return mapToResponse(room);
    }
    @Transactional(readOnly = true)
    public Page<RoomResponse> getAllRooms(Pageable pageable) {
        Page<Room> roomsPage = roomRepository.findAll(pageable);
        
        return roomsPage.map(this::mapToResponse);
    }

    private RoomResponse mapToResponse(Room room) {
        List<String> playerNames = room.getPlayers().stream()
                .map(User::getUsername)
                .toList();
        return new RoomResponse(
                room.getId(),
                room.getName(),
                room.getCapacity(),
                playerNames.size(),
                playerNames
        );
    }

    @Transactional
    public RoomResponse updateRoom(Long roomId, RoomUpdateRequest request, String username) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("No room found with id " + roomId));

        if (!room.getOwner().getUsername().equals(username)) {
            throw new AccessDeniedException("You are not the owner of this room");
        }
        room.setName(request.name());
        room.setCapacity(request.capacity());
        return mapToResponse(room);
    }

    @Transactional
    public void deleteRoom(Long roomId, String username) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("No room found with id " + roomId));
        if (!room.getOwner().getUsername().equals(username)) {
            throw new AccessDeniedException("You are not the owner of this room");
        }
        roomRepository.delete(room);
    }

    @Transactional
    public RoomResponse joinRoom(String username, Long roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("No room found with id " + roomId));
        User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("No player found with id " + username));

        user.setCurrentRoom(room);
        return mapToResponse(room);
    }

    @Transactional
    public RoomResponse leaveRoom(String username, Long roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("No room found with id " + roomId));
        User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("No player found with username " + username));
        user.setCurrentRoom(null);
        return mapToResponse(room);
    }
}
