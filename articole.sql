DROP TABLE IF EXISTS articole
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
('Tricou Cleveland', 'Tricou de baschet, echipa Cleveland Cavaliers', 200, 'Tricouri', 'Nike', 20, '{"bumbac"}', 'albastru', True, 'tricou1.png'),
('Minge Wilson', 'Minge de Baschet Wilson NBA', 250, 'Minge', 'Altele', 50, '{"cauciuc"}', 'maro', False, 'ball1.png'),
('Jersey Bucks', 'Jersey Bucks Antetokounmpo', 400, 'Jersey', 'Nike', 15, '{"bumbac","panza"}', 'verde', True, 'jersey1.png'),
('Jersey Lakers', 'Jersey Lakers LeBron', 400, 'Jersey', 'Nike', 17, '{"bumbac","panza"}', 'galben', True, 'jersey2.png'),
('Pantaloni Nike', 'Pantaloni scurti de baschet Nike', 150, 'Pantaloni', 'Nike', 20, '{"bumbac","panza"}', 'negru', True, 'shorts1.png'),
('LeBron 16', 'Adidasi de baschet LeBron 16', 800, 'Incaltaminte', 'Nike', 44, '{"plastic","cauciuc","panza"}', 'alb', False, 'shoes1.png'),
('Dame 6', 'Adidasi de baschet Dame 6', 550, 'Incaltaminte', 'Adidas', 43, '{"cauciuc","panza"}', 'alb', False, 'shoes2.png'),
('Jordan 1 High', 'Adidasi Jordan 1 High Varsity Blue', 1400, 'Incaltaminte', 'Jordan', 45, '{"piele","cauciuc","plastic"}', 'albastru', True, 'shoes3.png'),
('', '', , '', '', , '{""}', '', , '.png'),
('', '', , '', '', , '{""}', '', , '.png'),
('', '', , '', '', , '{""}', '', , '.png'),
('', '', , '', '', , '{""}', '', , '.png'),
('', '', , '', '', , '{""}', '', , '.png'),
('', '', , '', '', , '{""}', '', , '.png'),
('', '', , '', '', , '{""}', '', , '.png'),
