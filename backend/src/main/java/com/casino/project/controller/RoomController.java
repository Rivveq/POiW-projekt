package com.casino.project.controller;

import com.casino.project.dto.room.RoomCreateRequest;
import com.casino.project.dto.room.RoomResponse;
import com.casino.project.dto.room.RoomUpdateRequest;
import com.casino.project.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    public RoomResponse createRoom(@Valid @RequestBody RoomCreateRequest request,
                                   @AuthenticationPrincipal UserDetails userDetails) {
        return roomService.createRoom(request, userDetails.getUsername());
    }

    @GetMapping("/{id}")
    public RoomResponse getRoom(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    @GetMapping
    public Page<RoomResponse> getAllRooms(
            @PageableDefault(size = 10, page = 0) Pageable pageable
    ) {
        return roomService.getAllRooms(pageable);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRoom(@PathVariable Long id,  @AuthenticationPrincipal UserDetails userDetails) {
        roomService.deleteRoom(id, userDetails.getUsername());
    }

    @PatchMapping("/{id}")
    public RoomResponse updateRoom(@PathVariable Long id, @RequestBody RoomUpdateRequest request, @AuthenticationPrincipal UserDetails userDetails){
        return roomService.updateRoom(id, request, userDetails.getUsername());
    }

    @PostMapping("/{id}/join")
    public RoomResponse joinRoom(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        return roomService.joinRoom(username, id);
    }

    @PostMapping("/{id}/leave")
    public RoomResponse leaveRoom(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        return roomService.leaveRoom(username, id);
    }
}