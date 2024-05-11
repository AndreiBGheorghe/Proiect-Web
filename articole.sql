DROP TYPE IF EXISTS marca;
DROP TYPE IF EXISTS tip_articol;
DROP TYPE IF EXISTS culori;

CREATE TYPE marca AS ENUM('Nike', 'Adidas', 'Under Armour', 'Anta', 'Reebok','Puma', 'Altele');
CREATE TYPE tip_articol AS ENUM('incaltaminte', 'pantaloni', 'tricou', 'jersey', 'accesorii', 'minge');
CREATE TYPE culori AS ENUM('alb', 'negru', 'gri', 'rosu', 'portocaliu', 'galben', 'mov', 'albastru', 'verde');

CREATE TABLE IF NOT EXISTS articole (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   tip_produs tip_articol DEFAULT 'incaltaminte',
   brand marca DEFAULT 'Nike',
   dimensiune INT NOT NULL CHECK (dimensiune>=0),
   materiale VARCHAR [],
   culoare_principala culori DEFAULT 'alb',
   de_strada BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into articole (nume, descriere, pret, tip_produs, brand, dimensiune, materiale, culoare_principala, de_strada, imagine, data_adaugare) VALUES 
('Tricou Cleveland', 'Tricou de baschet, echipa Cleveland Cavaliers', 300, 'tricou', 'Nike', 40, '{"bumbac"}', 'albastru', True, 'tricou1.png')