const menuButton = document.querySelector('#menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

const desktopNavigation = window.matchMedia('(min-width: 768px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const closeMenu = () => {
    navMenu.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '메뉴 열기');
};

const getScrollBehavior = () => {
    return reducedMotion.matches ? 'auto' : 'smooth';
};

menuButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');

    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (!targetSection) {
            return;
        }

        event.preventDefault();

        targetSection.scrollIntoView({
            behavior: getScrollBehavior(),
        });

        closeMenu();
    });
});

desktopNavigation.addEventListener('change', ({ matches }) => {
    if (matches) {
        closeMenu();
    }
});

const currentYear = document.querySelector('#current-year');

currentYear.textContent = new Date().getFullYear();

const siteHeader = document.querySelector('#site-header');
const scrollTopButton = document.querySelector('#scroll-top');
const revealElements = document.querySelectorAll('.reveal');

document.documentElement.classList.add('js-enabled');

const renderScrollState = () => {
    const scrollY = window.scrollY;

    siteHeader.classList.toggle('scrolled', scrollY >= 60);

    scrollTopButton.classList.toggle('visible', scrollY >= 300);
};

window.addEventListener('scroll', renderScrollState, { passive: true });
renderScrollState();

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: getScrollBehavior(),
    });
});

if (
    reducedMotion.matches
    || !('IntersectionObserver' in window)
) {
    revealElements.forEach((element) => {
        element.classList.add('visible');
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.2,
        },
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

const themeButton = document.querySelector('#theme-toggle');
const themeIcon = themeButton.querySelector('span');
const THEME_STORAGE_KEY = 'portfolio-theme';

const readStoredTheme = () => {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
        console.warn('테마 설정을 읽을 수 없습니다.', error);
        return null;
    }
};

const saveTheme = (theme) => {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        console.warn('테마 설정을 저장할 수 없습니다.', error);
    }
};

const storedTheme = readStoredTheme();

const systemDarkTheme = window.matchMedia(
    '(prefers-color-scheme: dark)',
);

const hasStoredTheme = storedTheme === 'dark' || storedTheme === 'light';

let theme = hasStoredTheme
    ? storedTheme
    : systemDarkTheme.matches
    ? 'dark' : 'light';

const renderTheme = () => {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = theme;
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    themeButton.setAttribute(
        'aria-label',
        isDark ? '라이트 모드로 전환' : '다크 모드로 전환'
    );
};

themeButton.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    saveTheme(theme);
    renderTheme();
});

renderTheme();

// hero typing effect
const typingText = document.querySelector('#typing-text');
const typingCursor = document.querySelector('.typing-cursor');
const typingPhrases = [
    '웹 개발의 기초를 공부합니다.',
    '배운 내용을 직접 구현합니다.',
    '더 나은 코드를 고민합니다.',
];

const typingState = {
    phraseIndex: 0,
    characterIndex: 0,
    isDeleting: false,
    timerId: null,
};

const renderTypingText = () => {
    const phrase = typingPhrases[typingState.phraseIndex];
    typingText.textContent = phrase.slice(0, typingState.characterIndex);
};

const scheduleTypingStep = (delay) => {
    typingState.timerId = window.setTimeout(runTypingStep, delay);
};

const runTypingStep = () => {
    const phrase = typingPhrases[typingState.phraseIndex];

    if (!typingState.isDeleting && typingState.characterIndex < phrase.length) {
        typingState.characterIndex += 1;
        renderTypingText();
        scheduleTypingStep(80);
        return;
    }

    if (!typingState.isDeleting) {
        typingState.isDeleting = true;
        scheduleTypingStep(1400);
        return;
    }

    if (typingState.characterIndex > 0) {
        typingState.characterIndex -= 1;
        renderTypingText();
        scheduleTypingStep(40);
        return;
    }

    typingState.isDeleting = false;
    typingState.phraseIndex = (
        typingState.phraseIndex + 1
    ) % typingPhrases.length;
    scheduleTypingStep(300);
};

const initializeTypingEffect = () => {
    if (typingState.timerId !== null) {
        window.clearTimeout(typingState.timerId);
        typingState.timerId = null;
    }

    typingState.phraseIndex = 0;
    typingState.characterIndex = 0;
    typingState.isDeleting = false;

    if (reducedMotion.matches) {
        typingText.textContent = typingPhrases[0];
        typingCursor.hidden = true;
        return;
    }

    typingCursor.hidden = false;
    renderTypingText();
    scheduleTypingStep(500);
};

reducedMotion.addEventListener('change', initializeTypingEffect);
initializeTypingEffect();

// form
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const submitButton = contactForm.querySelector('button[type="submit"]');

const fields = [
    ...contactForm.querySelectorAll('input, textarea')
];

const createTouchedState = () => {
    return Object.fromEntries(
        fields.map((field) => [field.name, false]),
    );
};

const formState = {
    errors: {},
    touched: createTouchedState(),
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateField = ({name, value}) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return '필수 입력 항목입니다.';
    }

    if (name === 'email'
        && !emailPattern.test(trimmedValue)
    ) {
        return '올바른 형식의 이메일을 입력해 주세요.';
    }
    return '';
};

const renderFieldError = (field) => {
    const message = formState.errors[field.name] || '';

    const errorElement = document.querySelector(`#${field.name}-error`);
    const hasError = Boolean(message);

    errorElement.textContent = message;
    field.setAttribute('aria-invalid', String(hasError));
    field.setAttribute('aria-describedby', errorElement.id);
};

fields.forEach((field) => {
    field.addEventListener('input', () => {
        formStatus.textContent = '';

        if (!formState.touched[field.name]) {
            return;
        }

        formState.errors[field.name] = validateField(field);
        renderFieldError(field);
    });
});

contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    formState.touched = Object.fromEntries(
        fields.map((field) => [field.name, true]),
    );
    formState.errors = Object.fromEntries(
        fields.map((field) => [
            field.name,
            validateField(field),
    ]),
    );
    fields.forEach(renderFieldError);

    const firstInvalidField = fields.find((field) => {
        return formState.errors[field.name];
    });

    if (firstInvalidField) {
        formStatus.classList.add('error');
        formStatus.textContent = '입력 내용을 다시 확인해 주세요.';

        firstInvalidField.focus();
        return;
    }

    formStatus.classList.remove('error');
    formStatus.textContent = '메시지를 전송하는 중입니다.';

    submitButton.disabled = true;
    submitButton.textContent = '전송 중...';
    contactForm.setAttribute('aria-busy', 'true');

    try {
        const response = await fetch(contactForm.action, {
            method: contactForm.method,
            headers: {
                'Accept': 'application/json',
            },
            body: new FormData(contactForm),
        });
        if (!response.ok) {
            throw new Error(`전송에 실패했습니다 : ${response.status}`);
        }

        formStatus.textContent = '전송에 성공하였습니다. 감사합니다!';
        contactForm.reset();
        formState.errors = {};
        formState.touched = createTouchedState();
        fields.forEach(renderFieldError);
    } catch (error) {
        console.error('문의 전송에 실패했습니다.', error);
        formStatus.classList.add('error');
        formStatus.textContent = '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = '보내기';
        contactForm.setAttribute('aria-busy', 'false');
    }
});

const GITHUB_USERNAME = 'wasw2123';
const projectsContent = document.querySelector('#projects-content');
const projectFilter = document.querySelector('#project-filters');

const projectState = {
    status: 'idle',
    repositories: [],
    error: '',
    selectedLanguage: 'All',
};

const escapeHtml = (value = '') => {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
};

const normalizeRepository = (repository) => {
    const {
        id,
        name,
        description,
        html_url: url,
        language,
        stargazers_count: stars,
        fork,
        archived,
        updated_at: updatedAt,
    } = repository;

    return {
        id,
        name,
        description: description || 'No description provided.',
        url,
        language: language || 'Other',
        stars,
        fork,
        archived,
        updatedAt,
    };
};

const getProjectErrorMessage = (status) => {
    if (status === 403) {
        return 'API 요청 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.';
    }

    if (status === 404) {
        return '사용자를 찾을 수 없습니다.';
    }

    return '프로젝트를 불러올 수 없습니다.';
};

const renderProjectFilter = () => {
    const languages = [
        'All',
        ...new Set(
            projectState.repositories.map(
                ({ language }) => language,
            ),
        ),
    ];

    projectFilter.innerHTML = languages
    .map((language) => {
        const isSelected = language === projectState.selectedLanguage;
        return `
            <button
                class="filter-button${isSelected ? ' active' : ''}"
                type="button"
                data-language="${escapeHtml(language)}"
                aria-pressed="${isSelected}"
            >
                ${escapeHtml(language)}
            </button>
        `;
    })
    .join('');
};





const renderProjects = () => {
    if (projectState.status === 'loading') {
        projectsContent.innerHTML = `
        <p class="status-message">
            <span
                class="loading-spinner"
                aria-hidden="true"></span>
            프로젝트를 불러오는 중입니다...
        </p>
        `;
        return;
    }

    if (projectState.status === 'error') {
        projectsContent.innerHTML = `
            <div class="status-message" role="alert">
                <p>${escapeHtml(projectState.error)}</p>
                <button
                    class="button button-secondary"
                    type="button"
                    data-retry-projects>
                    다시 시도
                </button>
            </div>
        `;
        return;
    }

    if (projectState.status === 'empty') {
        projectsContent.innerHTML = `
            <p class="status-message">
                표시할 프로젝트가 없습니다.
            </p>
        `;
        return;
    }

    if (projectState.status === 'success') {
        const visibleRepositories =
            projectState.repositories.filter(({ language }) => {
                if (projectState.selectedLanguage === 'All') {
                    return true;
                }
                return language === projectState.selectedLanguage;
            });

        if (visibleRepositories.length === 0) {
            projectsContent.innerHTML = `
                <p class="status-message">
                    선택한 언어에 해당하는 프로젝트가 없습니다.
                </p>
            `;
            return;
        }

        const cards = visibleRepositories
            .map((repository) => {
                const {
                    name,
                    description,
                    url,
                    language,
                    stars,
                    updatedAt,
                } = repository;

                const updatedDate = new Intl.DateTimeFormat(
                    'ko-KR',
                ).format(new Date(updatedAt));

                return `
                    <article class="project-card">
                        <h3>${escapeHtml(name)}</h3>
                        <p>${escapeHtml(description)}</p>
                        <p class="project-meta">
                            <span>${escapeHtml(language)}</span>
                            <span>⭐️ ${escapeHtml(stars)}</span>
                            <span>마지막 업데이트: ${escapeHtml(updatedDate)}</span>
                        </p>
                        <a
                            class="button button-secondary"
                            href="${escapeHtml(url)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub에서 보기
                        </a>
                    </article>
                `;
            })
            .join('');

        projectsContent.innerHTML = `
            <p class="status-message">
                총 ${visibleRepositories.length}개의 프로젝트를 불러왔습니다.
            </p>
            <div class="projects-grid">
                ${cards}
            </div>
        `;
    }
};

projectFilter.addEventListener('click', (event) => {
    const button = event.target.closest(
        '[data-language]',
    );

    if (!button) {
        return;
    }

    projectState.selectedLanguage = button.dataset.language;
    renderProjectFilter();
    renderProjects();
});

const loadProjects = async () => {
    projectState.status = 'loading';
    projectState.repositories = [];
    projectState.error = '';

    renderProjects();

    try {
        const endpoint = [
            'https://api.github.com/users',
            encodeURIComponent(GITHUB_USERNAME),
            'repos?sort=updated&per_page=12',
        ].join('/');

        const response = await fetch(endpoint, {
            headers: {
                Accept: 'application/vnd.github+json',
            },
        });

        if (!response.ok) {
            const httpError = new Error(
                `GitHub API returned ${response.status}`,
            );
            httpError.status = response.status;
            throw httpError;
        }

        const rawRepositories = await response.json();

        if (!Array.isArray(rawRepositories)) {
            throw new Error('Unexpected GitHub API response.');
        }

        const repositories = rawRepositories
            .filter(({ fork, archived }) => {
                return !fork && !archived;
            })
            .map(normalizeRepository);

        projectState.repositories = repositories;
        projectState.status = repositories.length > 0
            ? 'success'
            : 'empty';
    } catch (error) {
        projectState.status = 'error';
        projectState.repositories = [];
        projectState.error = getProjectErrorMessage(error.status);
    }

    if (projectState.status === 'success') {
        renderProjectFilter();
    } else {
        projectFilter.textContent = '';
    }

    renderProjects();
};

projectsContent.addEventListener('click', (event) => {
    const retryButton = event.target.closest(
    '[data-retry-projects]',
    );

    if (!retryButton) {
        return;
    }
    loadProjects();
});

loadProjects();

