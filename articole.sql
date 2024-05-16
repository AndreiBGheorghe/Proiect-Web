DROP TABLE IF EXISTS articole;
DROP TYPE IF EXISTS marca;
DROP TYPE IF EXISTS tip_articol;
DROP TYPE IF EXISTS culori;

CREATE TYPE marca AS ENUM('Nike', 'Adidas', 'Jordan', 'Under Armour', 'Anta', 'Reebok', 'Puma', 'Altele');
CREATE TYPE tip_articol AS ENUM('Incaltaminte', 'Pantaloni', 'Tricouri', 'Jersey', 'Accesorii', 'Minge');
CREATE TYPE culori AS ENUM('alb', 'negru', 'gri', 'rosu', 'portocaliu', 'galben', 'mov', 'albastru', 'verde', 'maro');

CREATE TABLE IF NOT EXISTS articole (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   tip_produs tip_articol DEFAULT 'Incaltaminte',
   brand marca DEFAULT 'Nike',
   dimensiune INT NOT NULL CHECK (dimensiune>=0),
   materiale VARCHAR [],
   culoare_principala culori DEFAULT 'alb',
   de_strada BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into articole (nume, descriere, pret, tip_produs, brand, dimensiune, materiale, culoare_principala, de_strada, imagine) VALUES 
('Tricou Cleveland', 'Tricou de baschet Cleveland Cavaliers', 200, 'Tricouri', 'Nike', 20, '{"bumbac"}', 'albastru', True, 'shirt1.png'),
('Minge Wilson', 'Minge de Baschet Wilson NBA', 250, 'Minge', 'Altele', 50, '{"cauciuc"}', 'maro', False, 'ball1.png'),
('Jersey Bucks', 'Jersey Bucks Antetokounmpo', 400, 'Jersey', 'Nike', 15, '{"bumbac","panza"}', 'verde', True, 'jersey1.png'),
('Jersey Lakers', 'Jersey Lakers LeBron', 400, 'Jersey', 'Nike', 17, '{"bumbac","panza"}', 'galben', True, 'jersey2.png'),
('Pantaloni Nike', 'Pantaloni scurti de baschet Nike', 150, 'Pantaloni', 'Nike', 20, '{"bumbac","panza"}', 'negru', True, 'shorts1.png'),
('LeBron 16', 'Adidasi de baschet LeBron 16', 800, 'Incaltaminte', 'Nike', 44, '{"plastic","cauciuc","panza"}', 'alb', False, 'shoes1.png'),
('Dame 6', 'Adidasi de baschet Dame 6', 550, 'Incaltaminte', 'Adidas', 43, '{"cauciuc","panza"}', 'alb', False, 'shoes2.png'),
('Jordan 1 High Blue', 'Adidasi Jordan 1 High Varsity Blue', 1400, 'Incaltaminte', 'Jordan', 45, '{"piele","cauciuc","plastic"}', 'albastru', True, 'shoes3.png'),
('Air Force 1 White', 'Adidasi Air Force 1 Full-White', 600, 'Incaltaminte', 'Nike', 44, '{"piele","cauciuc","burete"}', 'alb', True, 'shoes4.png'),
('Jordan 1 Mid Yellow', 'Adidasi Jordan 1 Mid', 700, 'Incaltaminte', 'Jordan', 41, '{"piele","burete","plastic","cauciuc"}', 'galben', True, 'shoes5.png'),
('Jordan 4', 'Adidasi Jordan 4 Retro', 900, 'Incaltaminte', 'Jordan', 45, '{"piele","cauciuc","burete"}', 'alb', True, 'shoes6.png'),
('Air Force 1 Color', 'Adidasi Air Force 1', 650, 'Incaltaminte', 'Nike', 43, '{"piele","burete","cauciuc"}', 'albastru', True, 'shoes7.png'),
('UltraBoost', 'Adidasi UltraBoost Light', 850, 'Incaltaminte', 'Adidas', 40, '{"panza","burete","cauciuc"}', 'alb', True, 'shoes8.png'),
('Jordan 1 High Red', 'Adidasi Jordan 1 High OffWhite', 1700, 'Incaltaminte', 'Jordan', 44, '{"piele","cauciuc"}', 'rosu', True, 'shoes9.png'),
('Jersey Bulls', 'Jersey Bulls Rose', 450, 'Jersey', 'Nike', 16, '{"bumbac","panza"}', 'rosu', True, 'jersey3.png'),
('Tricou NBA', 'Tricou de baschet NBA', 200, 'Tricouri', 'Nike', 20, '{"bumbac"}', 'gri', True, 'shirt2.png')