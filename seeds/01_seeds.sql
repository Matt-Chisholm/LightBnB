

INSERT INTO users (id, name, email, password)
VALUES  (1, 'Eva Stanley', 'sebastianguerra@ymail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ),
(2, 'Dominic Parks', 'victoriablackwell@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Louisa Meyer', 'jacksonrose@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' );

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,
parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES  
(1, 'Speed lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 930.61, 6, 4, 8, 'Canada', '536 Namsub Highway',
'Sotboske', 'Quebec', 28142, true),
(2, 'Habit mix', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 400, 2, 6, 4, 'Canada', '241 little mountain ave',
'Gull Lake', 'Alberta', 82912, true),
(3, 'Headed know', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 750, 5, 3, 6, 'Canada', '777 herald street',
'Vancouver', 'British Columbia', 12345, false);

INSERT INTO reservations (start_date, end_date, property_id, guest_id) 
VALUES 
('2018-09-11', '2018-09-16', 1, 1),
('2019-10-10', '2019-10-15', 2, 2),
('2019-11-20', '2019-11-25', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)  
VALUES 
(2, 2, 2, 7, 'messages'),
(1, 1, 1, 10, 'messages'),
(3, 3, 3, 6, 'messages');