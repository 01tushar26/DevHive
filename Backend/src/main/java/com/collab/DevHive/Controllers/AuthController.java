package com.collab.DevHive.Controllers;


import com.collab.DevHive.DTO.LoginDTO;
import com.collab.DevHive.DTO.LoginResponseDTO;
import com.collab.DevHive.DTO.SignUpRequestDTO;
import com.collab.DevHive.DTO.UserDTO;
import com.collab.DevHive.Security.AuthService;
import com.collab.DevHive.Security.JWTService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signUp(@RequestBody SignUpRequestDTO dto){
        UserDTO userDTO = authService.signupUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> logIn(@RequestBody LoginDTO dto , HttpServletResponse response){

      LoginResponseDTO loginResponseDTO = authService.loginUser(dto);
        Cookie cookie = new Cookie("refreshToken", loginResponseDTO.getRefreshToken());

        cookie.setHttpOnly(true); // Prevents client-side scripts from accessing the cookie
        response.addCookie(cookie);

        return ResponseEntity.ok(loginResponseDTO);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refreshToken(HttpServletRequest request){

        String refreshToken = Arrays.stream(request.getCookies())
                .filter(p->"refreshToken".equals(p.getName()))
                .findFirst()
                .map(Cookie::getValue).
                orElseThrow(()->new AuthenticationServiceException("RefreshToken not found"));

       LoginResponseDTO loginResponseDTO= authService.refresh(refreshToken);

        return ResponseEntity.ok(loginResponseDTO);
    }

    @PostMapping("/logout")
    public ResponseEntity<Boolean> logout(HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = Arrays.stream(request.getCookies())
                .filter(c -> "refreshToken".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (refreshToken != null) {
            authService.logout(refreshToken);
        }

        // remove cookie
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(true);
    }



}
