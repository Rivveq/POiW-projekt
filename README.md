# 🎰 Virtual Casino Project

Profesjonalna platforma hazardowa realizowana jako projekt studencki. Aplikacja oparta jest na architekturze rozproszonej z wydzielonym "jądrem" biznesowym w języku Java oraz nowoczesnym interfejsem użytkownika w bibliotece React.

---

## 🏗️ Architektura Systemu

Projekt został podzielony na dwa główne moduły (Monorepo), co pozwala na niezależny rozwój warstwy wizualnej i logicznej:

* **Backend (Core):** Silnik gry oparty na Spring Boot 3.x, zarządzający logiką losowań, bezpieczeństwem oraz transakcjami.
* **Frontend (UI):** Responsywna aplikacja React (Vite) zapewniająca dynamiczne wrażenia z gry.
* **Database:** Lekka baza SQLite (plikowa), zapewniająca zerową konfigurację przy starcie projektu.

---

## 📂 Struktura Katalogów

```text
v-casino/
├── backend/                # Logika serwerowa (Spring Boot)
│   ├── src/main/java/      # Kod źródłowy (Controllers, Services, Models)
│   ├── src/main/resources/ # Konfiguracja (application.properties)
│   └── pom.xml             # Zależności Maven
├── frontend/               # Interfejs użytkownika (React)
│   ├── src/                # Komponenty JSX i style CSS
│   ├── public/             # Zasoby statyczne (obrazy, ikony)
│   └── package.json        # Konfiguracja NPM
├── casino.db               # Baza danych (generowana przy starcie)
└── README.md               # Dokumentacja główna
```

---

## 🚀 Instrukcja Uruchomienia
### 1. Wymagania wstępne

*    Java JDK 17 lub nowsza (zalecana 21+).

*    Node.js (wersja LTS).

*    Dowolne IDE (zalecane IntelliJ IDEA dla Backend i VS Code dla Frontend).


### 2. Uruchomienie Backend (API)

*    Przejdź do folderu backend.

*   Otwórz projekt w IDE i uruchom klasę główną CasinoApp (znajdującą się w pakiecie głównym).

*   Alternatywnie użyj terminala:
    Bash

*   ./mvnw spring-boot:run

*   Serwer ruszy na porcie 8080. Status możesz sprawdzić pod: http://localhost:8080/api/status


### 3. Uruchomienie Frontend (UI)

*    Przejdź do folderu frontend.

*    Zainstaluj niezbędne biblioteki:
     Bash

*    npm install

*   Uruchom aplikację w trybie deweloperskim:
    Bash

*   npm run dev

*   Otwórz adres wyświetlony w terminalu (zazwyczaj http://localhost:5173).

Oto sformatowany fragment sekcji Roadmap oraz Skład Zespołu, przygotowany w czystym kodzie Markdown. Możesz go wkleić bezpośrednio do swojego pliku README.md.
Markdown

---

## 🛠️ Roadmap Projektu

- [x] **Inicjalizacja struktury Monorepo** – wydzielenie folderów `backend` i `frontend`.
- [x] **Konfiguracja Spring Boot + SQLite** – integracja JPA/Hibernate i automatyczne tworzenie bazy.
- [x] **Implementacja szkieletu React (Vite)** – przygotowanie środowiska pod rozwój UI.
- [x] **Rozwiązanie problemów z polityką CORS** – umożliwienie komunikacji między portami 8080 a 5173.
- [ ] **Implementacja systemu rejestracji i logowania** – integracja ze Spring Security.
- [ ] **Rozwój jądra gier** – logika biznesowa dla Dice, Roulette oraz Slots.
- [ ] **Integracja portfela użytkownika z API** – przesyłanie stanu konta i obsługa zakładów.
- [ ] **Placeholder** – placeholder

---

## 👥 Skład Zespołu

| Imię i Nazwisko / Nick         | Rola w projekcie |
|:-------------------------------|:-----------------|
| **Oskar Zagórski / Rivveq**    | placeholder      |
| **Filip Paczuła / filipxcode** | placeholder      |
| **Paweł Paździor / xxx**       | placeholder      |
| **Paweł Wolny / xxx**          | placeholder      |
| **Witold Gawron / Witek3rook** | placeholder      |

---

> [!IMPORTANT]  
> **Note:** Baza danych SQLite jest skonfigurowana w trybie `ddl-auto: update`. Oznacza to, że tabele zostaną utworzone automatycznie przy pierwszym uruchomieniu aplikacji na podstawie encji Javy. Nie ma potrzeby ręcznego importowania skryptów SQL ani instalacji zewnętrznych serwerów bazodanowych.