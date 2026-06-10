package com.casino.project.service;

import com.casino.project.dto.room.RoomCreateRequest;
import com.casino.project.dto.room.RoomResponse;
import com.casino.project.dto.room.RoomUpdateRequest;
import com.casino.project.exception.ResourceNotFoundException;
import com.casino.project.model.Room;
import com.casino.project.model.RoomStatus;
import com.casino.project.model.User;
import com.casino.project.repository.RoomRepository;
import com.casino.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Transactional
    public RoomResponse createRoom(RoomCreateRequest request, String username) {
        User user = getUser(username);
        Room room = new Room();
        room.setName(request.name());
        room.setCapacity(request.capacity());
        room.setOwner(user);
        Room savedRoom = roomRepository.save(room);
        return mapToResponse(savedRoom);
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long roomId) {
        return mapToResponse(getRoom(roomId));
    }

    @Transactional(readOnly = true)
    public Page<RoomResponse> getAllRooms(Pageable pageable) {
        return roomRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional
    public RoomResponse updateRoom(Long roomId, RoomUpdateRequest request, String username) {
        Room room = getRoom(roomId);
        requireOwner(room, username, "You are not the owner of this room");
        room.setName(request.name());
        room.setCapacity(request.capacity());
        return mapToResponse(room);
    }

    @Transactional
    public void deleteRoom(Long roomId, String username) {
        Room room = getRoom(roomId);
        requireOwner(room, username, "You are not the owner of this room");
        roomRepository.delete(room);
    }

    @Transactional
    public RoomResponse joinRoom(String username, Long roomId) {
        Room room = getRoom(roomId);
        User user = getUser(username);

        if (room.getStatus() != RoomStatus.WAITING) {
            throw new IllegalStateException("Cannot join a room that is not waiting for players");
        }
        if (room.getPlayers().size() >= room.getCapacity()) {
            throw new IllegalStateException("Room is full");
        }

        user.setCurrentRoom(room);
        return mapToResponse(room);
    }

    @Transactional
    public RoomResponse leaveRoom(String username, Long roomId) {
        Room room = getRoom(roomId);
        User user = getUser(username);
        user.setCurrentRoom(null);
        return mapToResponse(room);
    }

    @Transactional
    public RoomResponse startGame(Long roomId, String username) {
        Room room = getRoom(roomId);
        requireOwner(room, username, "Only owner can start the game");

        if (room.getStatus() != RoomStatus.WAITING) {
            throw new IllegalStateException("Game already in progress or finished");
        }

        if (room.getPlayers().size() < room.getCapacity()) {
            throw new IllegalStateException("Not enough players to start");
        }

        room.setStatus(RoomStatus.IN_GAME);
        // Game state
        return mapToResponse(room);
    }

    @Transactional
    public RoomResponse gameStatus(Long roomId, String username) {
        // Game state
        return mapToResponse(getRoom(roomId));
    }

    @Transactional
    public RoomResponse gameAction(Long roomId, String username /* Action body here */) {
        // Game state
        return mapToResponse(getRoom(roomId));
    }

    @Transactional
    public RoomResponse endGame(Long roomId, String username) {
        // Game state
        return mapToResponse(getRoom(roomId));
    }

    private Room getRoom(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("No room found with id " + roomId));
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("No player found with username " + username));
    }

    private void requireOwner(Room room, String username, String message) {
        if (!room.getOwner().getUsername().equals(username)) {
            throw new AccessDeniedException(message);
        }
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
                playerNames,
                room.getStatus().name()
        );
    }
}
