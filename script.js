// Retro 2005-2006 JavaScript with Comic Sans theme and real music playback
// Simple and functional, just like the old days

// Global variables
var currentPage = 'home';
var isPlaying = false;
var currentSong = '';
var currentArtist = '';
var currentAudioFile = '';
var audioPlayer = null;
var songs = [
    { title: 'Happy Nation', artist: 'Ace of Base', file: './public/music/happy_nation.mp3' },
    { title: 'Can\'t Get You Out of My Head', artist: 'Kylie Minogue', file: './public/music/cant_get_you_out.mp3' },
    { title: 'Vamos a la Playa', artist: 'Loona', file: './public/music/vamos_a_la_playa.mp3' },
    { title: 'Get Lucky', artist: 'Daft Punk', file: null },
    { title: 'Blinding Lights', artist: 'The Weeknd', file: null },
    { title: 'Bad Guy', artist: 'Billie Eilish', file: null },
    { title: 'Circles', artist: 'Post Malone', file: null }
];
var currentSongIndex = 0;

// Initialize when page loads
window.onload = function() {
    showPage('home');
    
    // Initialize audio player
    audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) {
        audioPlayer.addEventListener('ended', function() {
            nextSong();
        });
        
        audioPlayer.addEventListener('loadstart', function() {
            window.status = 'Загрузка трека...';
        });
        
        audioPlayer.addEventListener('canplay', function() {
            window.status = 'Трек готов к воспроизведению';
        });
        
        audioPlayer.addEventListener('error', function() {
            window.status = 'Ошибка загрузки трека';
            alert('Не удалось загрузить аудиофайл. Проверьте подключение к интернету.');
        });
    }
    
    // Add some retro effects
    document.title = 'HELLO! - ' + new Date().toLocaleDateString();
    
    // Status bar message (old school)
    window.status = 'Добро пожаловать! Теперь с реальной музыкой!';
    
    // Add welcome message
    setTimeout(function() {
        window.status = 'Сайт загружен! Слушайте реальные MP3 треки!';
    }, 2000);
};

// Page navigation function
function showPage(pageId) {
    // Hide all pages
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }
    
    // Show selected page
    var targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
    }
    
    // Update navigation
    var navLinks = document.getElementsByClassName('nav-link');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active');
    }
    
    // Activate current nav link
    var navTexts = {
        'home': 'Главная',
        'info': 'Информация', 
        'music': 'Музыка',
        'wiki': 'Игровые статьи'
    };
    
    for (var i = 0; i < navLinks.length; i++) {
        if (navLinks[i].textContent === navTexts[pageId]) {
            navLinks[i].classList.add('active');
            break;
        }
    }
    
    // Update status bar based on page
    var statusMessages = {
        'home': 'Главная страница - добро пожаловать!',
        'info': 'Информация о сайте и создателе',
        'music': 'Музыкальный плеер с реальными MP3 файлами',
        'wiki': 'Игровые статьи с обложками игр из Википедии'
    };
    
    window.status = statusMessages[pageId] || 'Неизвестная страница';
}

// Music player functions
function playSong(title, artist, audioFile) {
    currentSong = title;
    currentArtist = artist;
    currentAudioFile = audioFile || null;
    
    // Find song index
    for (var i = 0; i < songs.length; i++) {
        if (songs[i].title === title && songs[i].artist === artist) {
            currentSongIndex = i;
            break;
        }
    }
    
    // Update display
    document.getElementById('current-song').textContent = title;
    document.getElementById('current-artist').textContent = artist;
    document.getElementById('cd-text').textContent = title.substring(0, 8) + '...';
    
    // Play audio if file exists
    if (audioFile && audioPlayer) {
        audioPlayer.src = audioFile;
        audioPlayer.load();
        audioPlayer.play().then(function() {
            isPlaying = true;
            updatePlayButton();
            
            // Start CD spinning
            var disc = document.getElementById('cd-disc');
            disc.classList.add('spinning');
            
            // Update status
            window.status = '♪ Играет: ' + title + ' - ' + artist + ' ♪';
            
        }).catch(function(error) {
            console.log('Ошибка воспроизведения:', error);
            window.status = 'Ошибка воспроизведения: ' + title;
            alert('Не удалось воспроизвести трек: ' + title + '\nВозможно, файл поврежден или недоступен.');
        });
    } else {
        // Simulate playback for songs without files
        isPlaying = true;
        updatePlayButton();
        
        // Start CD spinning
        var disc = document.getElementById('cd-disc');
        disc.classList.add('spinning');
        
        // Update status
        window.status = '♪ Эмуляция: ' + title + ' - ' + artist + ' ♪';
        
        // Show message for simulated tracks
        setTimeout(function() {
            alert('🎵 Эмуляция воспроизведения: ' + title + ' by ' + artist + '\n\nЭто виртуальный трек для демонстрации плеера.\nРеальные треки: Ace of Base, Kylie Minogue, Loona');
        }, 500);
    }
    
    // Highlight current song in playlist
    highlightCurrentSong();
}

function togglePlay() {
    if (currentAudioFile && audioPlayer) {
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            var disc = document.getElementById('cd-disc');
            disc.classList.remove('spinning');
            window.status = '⏸ Пауза: ' + currentSong;
        } else {
            audioPlayer.play().then(function() {
                isPlaying = true;
                var disc = document.getElementById('cd-disc');
                disc.classList.add('spinning');
                window.status = '▶ Воспроизведение: ' + currentSong;
            }).catch(function(error) {
                console.log('Ошибка воспроизведения:', error);
            });
        }
    } else {
        // Toggle simulation for virtual tracks
        isPlaying = !isPlaying;
        var disc = document.getElementById('cd-disc');
        if (isPlaying) {
            disc.classList.add('spinning');
            window.status = '▶ Эмуляция: ' + currentSong;
        } else {
            disc.classList.remove('spinning');
            window.status = '⏸ Пауза эмуляции: ' + currentSong;
        }
    }
    
    updatePlayButton();
}

function stopSong() {
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    
    isPlaying = false;
    updatePlayButton();
    
    var disc = document.getElementById('cd-disc');
    disc.classList.remove('spinning');
    
    window.status = '⏹ Остановлено: ' + currentSong;
}

function setVolume(value) {
    if (audioPlayer) {
        audioPlayer.volume = value / 100;
        window.status = 'Громкость: ' + value + '%';
    }
}

function updatePlayButton() {
    var playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.textContent = isPlaying ? '⏸' : '▶';
    }
}

function previousSong() {
    if (currentSongIndex > 0) {
        currentSongIndex--;
    } else {
        currentSongIndex = songs.length - 1;
    }
    
    var song = songs[currentSongIndex];
    playSong(song.title, song.artist, song.file);
}

function nextSong() {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0;
    }
    
    var song = songs[currentSongIndex];
    playSong(song.title, song.artist, song.file);
}

function highlightCurrentSong() {
    // Reset all rows
    var rows = document.querySelectorAll('.playlist-table tr');
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.backgroundColor = '';
    }
    
    // Highlight current song row
    var cells = document.querySelectorAll('.playlist-table td');
    for (var i = 0; i < cells.length; i++) {
        if (cells[i].textContent === currentSong || cells[i].textContent === currentArtist) {
            var row = cells[i].parentNode;
            row.style.backgroundColor = '#FFFF99';
            break;
        }
    }
}

// Retro effects and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to game covers
    var gameCovers = document.getElementsByClassName('game-cover');
    for (var i = 0; i < gameCovers.length; i++) {
        gameCovers[i].onmouseover = function() {
            window.status = 'Обложка игры - нажмите для увеличения';
        };
        
        gameCovers[i].onmouseout = function() {
            window.status = 'Готово';
        };
        
        gameCovers[i].onclick = function() {
            var alt = this.alt;
            alert('🎮 Просмотр обложки: ' + alt + '\n\nОригинальное изображение из Википедии!\n\n(Ретро-стиль 2005 года)');
        };
    }
    
    // Add hover effects to social links
    var socialLinks = document.getElementsByClassName('social-link');
    for (var i = 0; i < socialLinks.length; i++) {
        socialLinks[i].onmouseover = function() {
            window.status = 'Перейти к: ' + this.textContent;
        };
        
        socialLinks[i].onmouseout = function() {
            window.status = 'Готово';
        };
    }
    
    // Add hover effects to Wikipedia links
    setTimeout(function() {
        var wikiLinks = document.querySelectorAll('a[href*="wikipedia"]');
        for (var i = 0; i < wikiLinks.length; i++) {
            wikiLinks[i].onmouseover = function() {
                window.status = 'Открыть статью в Википедии';
            };
            
            wikiLinks[i].onmouseout = function() {
                window.status = 'Готово';
            };
        }
    }, 1000);
    
    // Add hover effects to music controls
    var musicButtons = document.querySelectorAll('.player-controls button');
    for (var i = 0; i < musicButtons.length; i++) {
        musicButtons[i].onmouseover = function() {
            var buttonText = this.textContent;
            var actions = {
                '◀◀': 'Предыдущий трек',
                '▶': 'Воспроизведение',
                '⏸': 'Пауза',
                '⏹': 'Остановить'
            };
            window.status = actions[buttonText] || 'Управление плеером';
        };
        
        musicButtons[i].onmouseout = function() {
            window.status = 'Готово';
        };
    }
    
    // Add retro loading message
    setTimeout(function() {
        window.status = 'Сайт загружен! Реальная музыка готова к прослушиванию! 🎵';
    }, 3000);
});

// Old school browser detection
function getBrowserInfo() {
    var browser = 'Неизвестный браузер';
    
    if (navigator.userAgent.indexOf('MSIE') > -1) {
        browser = 'Internet Explorer';
    } else if (navigator.userAgent.indexOf('Firefox') > -1) {
        browser = 'Mozilla Firefox';
    } else if (navigator.userAgent.indexOf('Chrome') > -1) {
        browser = 'Google Chrome';
    } else if (navigator.userAgent.indexOf('Safari') > -1) {
        browser = 'Safari';
    }
    
    return browser;
}

// Show browser info on info page
function showBrowserInfo() {
    alert('Информация о браузере:\n\n' + 
          'Браузер: ' + getBrowserInfo() + '\n' +
          'Версия: ' + navigator.appVersion + '\n' +
          'Платформа: ' + navigator.platform + '\n' +
          'Cookies включены: ' + (navigator.cookieEnabled ? 'Да' : 'Нет') + '\n' +
          'Аудио поддержка: ' + (audioPlayer ? 'Да' : 'Нет') + '\n' +
          'Шрифт: Comic Sans MS (как в 2005!)');
}

// Add some retro animations and effects
function addRetroEffects() {
    // Blinking text effect (classic!)
    var blinkElements = document.querySelectorAll('.blink');
    setInterval(function() {
        for (var i = 0; i < blinkElements.length; i++) {
            blinkElements[i].style.visibility = 
                blinkElements[i].style.visibility === 'hidden' ? 'visible' : 'hidden';
        }
    }, 500);
    
    // Random status bar messages for music and games
    var funMessages = [
        'Comic Sans + реальная музыка = идеальный сайт 2005!',
        'Слушайте Ace of Base - Happy Nation!',
        'Kylie Minogue - Can\'t Get You Out of My Head хит!',
        'Loona - Vamos a la Playa для летнего настроения!',
        'Читайте игровые статьи с обложками!',
        'Посетите мои социальные сети!',
        'Hotline Miami 2 - отличная игра!',
        'Call of Duty - классика жанра!',
        'GTA Vice City - атмосфера 80-х!',
        'Ретро-музыка и игры с 2005 года!'
    ];
    
    setInterval(function() {
        var randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];
        window.status = randomMessage;
    }, 15000);
}

// Initialize retro effects
window.onload = function() {
    showPage('home');
    addRetroEffects();
    
    // Initialize audio player
    audioPlayer = document.getElementById('audioPlayer');
    
    // Classic "Under Construction" easter egg with music theme
    var konami = [];
    var konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    
    document.addEventListener('keydown', function(e) {
        konami.push(e.keyCode);
        if (konami.length > konamiCode.length) {
            konami.shift();
        }
        
        if (konami.join(',') === konamiCode.join(',')) {
            alert('🎵 СЕКРЕТНАЯ МУЗЫКАЛЬНАЯ СТРАНИЦА! 🎵\n\n' +
                  'Поздравляем! Вы нашли пасхалку меломана 2005!\n\n' +
                  'Скоро здесь появятся:\n' +
                  '• Больше реальных MP3 треков\n' +
                  '• Эквалайзер в стиле Winamp\n' +
                  '• Плейлисты по жанрам\n' +
                  '• Визуализация музыки\n' +
                  '• Караоке режим\n\n' +
                  '🎧 Ретро-меломан Forever! 🎧');
            konami = [];
        }
    });
    
    // Add special music loading messages
    setTimeout(function() {
        console.log('🎵 Реальные MP3 файлы загружены!');
        console.log('🎮 Игровые обложки готовы!');
        console.log('📖 Википедия статьи активны!');
        console.log('📱 Социальные сети подключены!');
        console.log('🎧 Аудио плеер инициализирован!');
    }, 1000);
};