CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO activity_types (id, name, description, image) VALUES
(uuid_generate_v4(), 'Aerobic Exercises', 'Activities that improve cardiovascular conditioning, such as running and swimming.', 'http://localhost:4566/activity-type-images/default-activity-type-image.jpg'),
(uuid_generate_v4(), 'Strength Exercises', 'Activities focused on muscular endurance, such as weight training and powerlifting.', 'http://localhost:4566/activity-type-images/default-activity-type-image.jpg'),
(uuid_generate_v4(), 'Flexibility Exercises', 'Activities that enhance mobility, such as stretching and yoga.', 'http://localhost:4566/activity-type-images/default-activity-type-image.jpg'),
(uuid_generate_v4(), 'Balance Exercises', 'Activities that improve motor coordination, such as Tai Chi and functional training.', 'http://localhost:4566/activity-type-images/default-activity-type-image.jpg');

INSERT INTO achievements (id, name, criterion)
VALUES 
  (uuid_generate_v4(), 'Primeira atividade criada.', 'Criou a primeira atividade!'),
  (uuid_generate_v4(), 'Primeira inscrição em atividades.', 'Se inscreveu na primeira atividade!'),
  (uuid_generate_v4(), 'Primeira presença confirmada.', 'Confirmou presença na primeira atividade!'),
  (uuid_generate_v4(), 'Nível 5.', 'Alcançou o nivel 5!'),
  (uuid_generate_v4(), 'Nível 10.', 'Alcançou o nivel 10!');
