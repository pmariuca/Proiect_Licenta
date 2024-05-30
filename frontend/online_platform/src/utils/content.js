export const LOGIN_PAGE = {
    REMEMBER_USERNAME: 'Remember username',
    LOGIN_BUTTON: 'Log in',
    FORGOT_CREDENTIALS: 'Forgotten your username or password?',
    CREDENTIALS_LINK: 'https://www.net.ase.ro/student/',
    COOKIES: 'Cookies must be enabled in your browser.',
    EMPTY_FIELDS: 'Invalid login, please try again.',
};

export const FOOTER = {
    NOT_LOGGED_IN: 'You are not logged in.',
    LOGGED_IN: 'Sunteți conectat în calitate de ',
    HOME: {
        ENG: 'Home',
        RO: 'Acasă'
    },
    DATA_RETENTION: {
        ENG: 'Data retention summary',
        RO: 'Rezumatul păstrării datelor'
    },
    MOBILE_APP: {
        ENG: 'Get the mobile app',
        RO: 'Obțineți aplicația mobilă'
    },
};

export const NAVBAR = {
    TITLE: 'BL@ASE',
    LANGUAGE: 'Română (ro)',
    LOGOUT: 'Delogare',
    MENU_DRAWER: {
        HOME: 'Acasă',
        BOARD: 'Tablou de bord',
        CALENDAR: 'Calendar',
        PRIVATE_FILES: 'Fișiere private',
        COURSES: 'Cursurile mele',
        MORE: 'Mai multe...'
    }
};

export const PLATFORM_DETAILS = {
    TITLE: 'MESAJE ADMINISTRATOR BL@ASE',
    ATTENTION: {
        TITLE: 'ÎN ATENȚIA TUTUROR UTILIZATORILOR PLATFORMEI DE BLENDED LEARNING@ASE',
        TEXT: 'Recomandam ca navigatorul Internet(browser) folosit pentru conectarea la platforma online.ase.ro (Mozilla Firefox, Edge Chromium, Chrome, Safari) să fie actualizat la ultima versiune.'
    },
    AUTH: {
        TITLE: 'Autentificarea se realizeaza astfel:',
        PROF: {
            TEXT_BOLD: 'Cadre didactice - UtilizatorulIDM@ase.ro (cont-intranet@ase.ro)',
            TEXT_NORMAL: ' impreuna cu parolaIDM asociata;'
        },
        STUD: {
            TEXT_BOLD: 'Studenti - UtilizatorulIDM@stud.ase.ro (cont-intranet@stud.ase.ro)',
            TEXT_NORMAL: ' impreuna cu parolaIDM asociata;'
        },
    },
    ACCOUNTS: {
        TITLE: 'CONTURI UTILIZATE DE CATRE STUDENTI IN INFRASTRUCTURA INFORMATIONALA ASE',
        TEXT: 'Fiecare student ASE are asociate  mai multe conturi care seamana foarte mult, dar au parola specifica si moduri de utilizare diferite:',
        LIST: {
            IDM: 'Contul IDM',
            ACADEMIC: 'Contul de email institutional',
            MICROSOFT: 'Contul Microsoft ASE'
        },
        SERVICES: {
            SERVICES: 'Serviciile de Date & Comunicatii precum si conturile alocate se utilizeaza respectand ',
            POLICY: 'Politica de securitate IT in cadrul ASE.\n',
            MANUAL_ENROLMENT_BOLD: 'NU este necesara inrolarea manuala pentru servicii O365 pentru studenti!\n',
            INSTRUCTIONS: 'Daca v-ati inrolat MANUAL in Office 365 for Education, pe baza emailului de student, setand numele, prenumele si o parola personala, confirmand contul pe baza unui cod primit pe emailul de student, contul licentiat oferit de ASE poate genera anumite erori, asadar este necesar sa transmiteti email catre it-suport@ase.ro pentru remediere. Cand solicitati sprijin catre it-suport@ase.ro este recomandat sa specificati cat mai clar problema intampinata, incluzand capturi de ecran care sa includa adresa platformei accesate.'
        }
    }
};

export const COURSE_PAGE = {
    HOME: 'Acasă',
    DISCIPLINE: 'Fișa disciplinei',
    ANNOUNCEMENTS: 'Anunțuri',
    ADD_ACTIVITY: 'Adaugă activitate',
};

export const ADD_ACTIVITY = {
    TITLE: 'Adaugăre activitate',
    CHOOSE: {
        INTERVAL: 'Alege intervalul',
        LIMIT: 'Alege data limită'
    },
    GENERAL: {
        TITLE: 'General',
        NAME: 'Nume',
        DESCRIPTION: 'Descriere'
    },
    DISPONIBILITY: {
        TITLE: 'Disponibilitate',
        START_DATE: 'Data de început',
        END_DATE: 'Data de sfârșit',
        LIMIT_DATE: 'Data limită',
        START_TIME: 'Ora de început',
        END_TIME: 'Ora de sfârșit',
    },
    ANSWERS: {
        TITLE: 'Tipuri de răspuns',
        CHOICE: 'Alegere',
        UPLOAD: 'Încărcare'
    },
    ACCESS: {
        TITLE: 'Restricționare acces',
        FRC: 'Recunoaștere facială',
        HUBSTAFF: 'Hubstaff'
    },
    QUESTIONS: {
        TITLE: 'Întrebări',
        NUMBER_OF_QUESTIONS: 'Numărul de întrebări',
        TIME_LIMIT: 'Limită de timp'
    },
    BUTTON: 'Adaugă',
    ALERT: 'Toate câmpurile sunt obligatorii!'
}

export const TEST_PAGE = {
    BACHELOR: 'Licență',
    FACE_RECOGNITION: 'Pentru acest test este necesară recunoașterea facială.',
    HUBSTAFF: 'Pentru acest test este necesară folosirea aplicației de monitorizare.',
    START_MSG: 'Pentru a începe testul, apasă butonul de mai jos.',
    START_BUTTON: 'Începe testul',
    TEST_UNAVAILABLE: 'Testul nu este disponibil.',
    GDPR: 'Confirm că am citit și înțeles Politica de Confidențialitate și sunt de acord ca datele mele biometrice (imaginea facială) să fie colectate și procesate pentru scopul autentificării prin recunoaștere facială. De asemenea, sunt de acord ca în timpul utilizării platformei să fie luate capturi de ecran pentru monitorizarea integrității testărilor și confirm că am fost informat(ă) despre drepturile mele conform Regulamentului General pentru Protecția Datelor (GDPR).',
    CHECK_BUTTON: 'Verifică identitatea',
    GDPR_ALERT: 'Trebuie să bifați căsuța GDPR pentru a continua.',
    TRY_AGAIN: 'Mai ai o încercare pentru a efectua recunoașterea facială. Asigură-te că lumina este bună.',
}

export const QUESTION_PAGE = {
    TITLE: ' întrebare',
    NEXT: 'Următoarea întrebare',
    SUBMIT: 'Trimite răspunsul',
    TIME_LEFT: 'Timp rămas: ',
    ANSWERS_SAVED: 'Răspunsurile au fost salvate. Puteți să vă întoarceți pe Homepage.',
    HOMEPAGE: 'Homepage',
    ALERT: 'Încercările de fraudare a testului sunt interzise!',
    POINTS: 'Marcat cu '
}

export const RESULTS_PAGE = {
    NO_ANSWERS: 'Nu există răspunsuri pentru acest test.',
    ALL_ANSWERS: 'Descarcă toate răspunsurile',
    ALL_PHOTOS: 'Descarcă toate capturile de ecran',
    DOWNLOAD_STUDENT: 'Descarcă răspunsurile unui student',
    DOWNLOAD: 'Descarcă',
    SELECT_STUDENT: 'Selectează studentul',
    ATTENDANCE: 'Descarcă lista de prezență',
    ATTENDANCE_TYPE: 'Alege formatul',
    ATTENDANCE_PDF: 'Format PDF',
    ATTENDANCE_EXCEL: 'Format Excel'
}

export const FILE_QUESTION = {
    ADD: 'Trageți fișierele aici sau clic pentru a selecta fișiere'
}