package com.casino.project.service;

import com.casino.project.model.Room;
import com.casino.project.model.User;
import com.casino.project.repository.RoomRepository;
import com.casino.project.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock private RoomRepository roomRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private RoomService roomService;

    @Test
    void shouldThrowExceptionWhenRoomIsFull() {
        // given
        Room fullRoom = new Room();
        fullRoom.setCapacity(1);
        fullRoom.setPlayers(new ArrayList<>(java.util.List.of(new User()))); // 1 gracz już jest

        when(roomRepository.findById(1L)).thenReturn(Optional.of(fullRoom));
        when(userRepository.findByUsername("gracz")).thenReturn(Optional.of(new User()));

        // when & then
        assertThrows(IllegalStateException.class, () -> {
            roomService.joinRoom("gracz", 1L);
        });
    }
}