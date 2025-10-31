-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Sessions table
CREATE TABLE sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    last_accessed_at TIMESTAMP
);

-- Balances table
CREATE TABLE balances (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Banners table
CREATE TABLE banners (
    id BIGSERIAL PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL,
    banner_image VARCHAR(255) NOT NULL,
    description VARCHAR(500)
);

-- Services table
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_icon VARCHAR(255),
    service_tariff DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT REFERENCES services(id) ON DELETE SET NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    transaction_type VARCHAR(50),
    description VARCHAR(500),
    total_amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_balances_user_id ON balances(user_id);
CREATE INDEX idx_services_code ON services(service_code);
CREATE INDEX idx_transactions_invoice ON transactions(invoice_number);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Sample data for banners
INSERT INTO banners (banner_name, banner_image, description) VALUES
('Welcome Banner', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-1.png', 'Welcome to our service'),
('Promo Banner', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-2.png', 'Special promotion this month'),
('Feature Banner', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-3.png', 'Check out our new features');

-- Sample data for services
INSERT INTO services (service_code, service_name, service_icon, service_tariff, created_at, updated_at) VALUES
('PLN', 'PLN Electricity', 'https://minio.nutech-integrasi.com/take-home-test/services/Listrik.png', 50000, NOW(), NOW()),
('PDAM', 'PDAM Water', 'https://minio.nutech-integrasi.com/take-home-test/services/PDAM.png', 30000, NOW(), NOW()),
('TELKOM', 'Telkom Internet', 'https://minio.nutech-integrasi.com/take-home-test/services/Paket-Data.png', 100000, NOW(), NOW()),
('PULSA', 'Mobile Credit', 'https://minio.nutech-integrasi.com/take-home-test/services/Pulsa.png', 25000, NOW(), NOW()),
('PAJAK', 'Pajak Tahunan', 'https://minio.nutech-integrasi.com/take-home-test/services/PBB.png', 150000, NOW(), NOW());