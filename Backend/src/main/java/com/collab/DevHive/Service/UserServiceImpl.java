package com.collab.DevHive.Service;

import com.collab.DevHive.Entities.User;
import com.collab.DevHive.Exceptions.ResourceNotFoundException;
import com.collab.DevHive.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepo;

    @Override
    public User getUserById(Long id) {
        return userRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("User is not found with id "+id));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
