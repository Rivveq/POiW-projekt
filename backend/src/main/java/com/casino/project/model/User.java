package com.casino.project.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data // To jest z Lombok - wygeneruje gettery, settery i toString automatycznie (podobno spoko wiec dodalem zobaczymy jak sie z tym pracuje)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password; // To do haszowania kiedys

    private Double balance = 100.0; // Kaska do becików na start
}
