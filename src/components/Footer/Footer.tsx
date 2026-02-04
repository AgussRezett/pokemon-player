import styles from './Footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p>Hecho con ❤️ para todos los fans de Pokémon</p>
                <p className={styles.copyright}>© 2026 Pokémon Tracker - Plataforma Gamificada</p>
            </div>
        </footer>
    );
}