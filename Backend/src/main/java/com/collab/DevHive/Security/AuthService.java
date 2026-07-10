package com.collab.DevHive.Security;


import com.collab.DevHive.DTO.LoginDTO;
import com.collab.DevHive.DTO.LoginResponseDTO;
import com.collab.DevHive.DTO.SignUpRequestDTO;
import com.collab.DevHive.DTO.UserDTO;
import com.collab.DevHive.Entities.RefreshToken;
import com.collab.DevHive.Entities.User;
import com.collab.DevHive.Exceptions.ResourceNotFoundException;
import com.collab.DevHive.Repositories.RefreshTokenRepository;
import com.collab.DevHive.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final ModelMapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    public UserDTO signupUser(SignUpRequestDTO signUpRequestDTO){

       if(userRepo.existsByEmail(signUpRequestDTO.getEmail())){
           throw new RuntimeException("User is already exist ");
       }
        User newUser = mapper.map(signUpRequestDTO,User.class);
        newUser.setPassword(passwordEncoder.encode(signUpRequestDTO.getPassword()));

        newUser =userRepo.save(newUser);
        return mapper.map(newUser,UserDTO.class);

    }
    @Transactional
    public LoginResponseDTO loginUser(LoginDTO loginDTO){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(),loginDTO.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        // todo-one user one login( later add session on devices)
      refreshTokenRepository.revokeAllByUser(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        RefreshToken tokenEntity = RefreshToken.builder()
                .token(refreshToken)
                .user(user)
                .expiryDate(new Date(System.currentTimeMillis() + 1000L *60*60*24*30*6))
                .revoked(false)
                .build();
        refreshTokenRepository.save(tokenEntity);

        return new LoginResponseDTO(user.getId(),accessToken,refreshToken);
    }

    //todo- regenerate refresh token again to increse the privacy
    public LoginResponseDTO refresh(String refreshToken){
        log.info("Refreshing the token");

        RefreshToken refreshToken1 = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(()->new AuthenticationServiceException("Invalid refresh token"));


        if(refreshToken1.isRevoked()){
            throw new AuthenticationServiceException("Token has been revoked");
        }

        if (refreshToken1.getExpiryDate().before(new Date())) {
            throw new AuthenticationServiceException("Token expired");
        }

        User user = refreshToken1.getUser();

        refreshToken1.setRevoked(true);
        refreshTokenRepository.save(refreshToken1);




        String newaccesstoken = jwtService.generateAccessToken(user);
        String newrefreshtoken = jwtService.generateRefreshToken(user);
        RefreshToken newTokenEntity = RefreshToken.builder()
                .token(newrefreshtoken)
                .user(user)
                .expiryDate(new Date(System.currentTimeMillis() +1000L * 60 * 60 * 24 * 30 * 6))
                .revoked(false)
                .build();
        refreshTokenRepository.save(newTokenEntity);

        return new LoginResponseDTO(user.getId(), newaccesstoken,newrefreshtoken);

    }

    public void logout(String refreshToken) {

     //todo-first checked whether the user is authenticate or not.
        RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        token.setRevoked(true);
        refreshTokenRepository.save(token);
    }
}
