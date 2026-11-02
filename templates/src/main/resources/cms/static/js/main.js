// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    
    // 导航栏滚动效果
    const header = document.querySelector('.header');
    const backToTop = document.getElementById('backToTop');

    let timer = null;
    window.addEventListener('scroll', function() {
        // 导航栏阴影效果
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
        
        // 返回顶部按钮显示/隐藏
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        clearTimeout(timer);
        timer = setTimeout(()=>{
            const viewH = window.innerHeight;
            const scrollY = window.scrollY;
            const page = Math.round(scrollY / viewH) + 1;
            console.log('当前屏：', page);

            document.querySelectorAll('.statics-item').forEach(el=>{
                if(page===2){
                    el.classList.add('active')
                }else{
                    el.classList.remove('active')
                }
            })

            if(page === 2){
                const aboutStats = document.querySelector('.statics-section');
                if (aboutStats) {
                    statsObserver.observe(aboutStats);
                }
            }else{

            }
        }, 20)
    });
    
    // 返回顶部功能
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 平滑滚动导航（仅针对锚点链接）
    const navLinks = document.querySelectorAll('.nav a, .footer-col a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // 检查 href 是否为有效的锚点链接（以 # 开头且后面有内容）
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                try {
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                        
                        // 更新活动导航项（仅对主导航）
                        if (this.closest('.nav') && !this.closest('.dropdown-menu')) {
                            document.querySelectorAll('.nav > ul > li > a').forEach(a => a.classList.remove('active'));
                            const parentLi = this.closest('li');
                            if (!parentLi.classList.contains('dropdown')) {
                                this.classList.add('active');
                            }
                        }
                    }
                } catch (error) {
                    console.error('Invalid selector:', href);
                }
            }
        });
    });
    
    // 首页轮播图
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicators = document.querySelectorAll('.hero-indicator');
    const heroPrevBtn = document.querySelector('.hero-nav-prev');
    const heroNextBtn = document.querySelector('.hero-nav-next');
    let heroSlideIndex = 0;
    let heroSlideTimer = null;

    const goToHeroSlide = (index) => {
        if (!heroSlides.length) return;
        const normalizedIndex = (index + heroSlides.length) % heroSlides.length;
        heroSlides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === normalizedIndex);
        });
        if (heroIndicators.length) {
            heroIndicators.forEach((indicator, idx) => {
                const isActive = idx === normalizedIndex;
                indicator.classList.toggle('active', isActive);
                indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        }
        heroSlideIndex = normalizedIndex;
    };

    const nextHeroSlide = () => {
        goToHeroSlide(heroSlideIndex + 1);
    };

    const prevHeroSlide = () => {
        goToHeroSlide(heroSlideIndex - 1);
    };

    const startHeroAutoplay = () => {
        if (heroSlides.length <= 1 || heroSlideTimer) return;
        heroSlideTimer = setInterval(nextHeroSlide, 6000);
    };

    const resetHeroAutoplay = () => {
        if (heroSlideTimer) {
            clearInterval(heroSlideTimer);
            heroSlideTimer = null;
        }
        startHeroAutoplay();
    };

    if (heroSlides.length) {
        goToHeroSlide(0);
        startHeroAutoplay();

        if (heroPrevBtn) {
            heroPrevBtn.addEventListener('click', () => {
                prevHeroSlide();
                resetHeroAutoplay();
            });
        }

        if (heroNextBtn) {
            heroNextBtn.addEventListener('click', () => {
                nextHeroSlide();
                resetHeroAutoplay();
            });
        }

        if (heroIndicators.length) {
            heroIndicators.forEach((indicator, idx) => {
                indicator.addEventListener('click', () => {
                    goToHeroSlide(idx);
                    resetHeroAutoplay();
                });
            });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (heroSlideTimer) {
                    clearInterval(heroSlideTimer);
                    heroSlideTimer = null;
                }
            } else {
                resetHeroAutoplay();
            }
        });
    }
    
    // 下拉菜单移动端支持
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const menu = dropdown.querySelector('.dropdown-menu');
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
    
    // 滚动动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 为各个板块添加动画
    const animateElements = document.querySelectorAll('.about, .service-card, .news-item, .partner-logo, .statics-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // 新闻标签切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            // 添加活动状态到当前按钮
            this.classList.add('active');
        });
    });
    
    // 视频播放控制
    const videoContainer = document.querySelector('.video-container');
    const mainVideo = document.querySelector('.main-video');
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (videoContainer && mainVideo && videoPlaceholder) {
        // 点击视频播放
        videoContainer.addEventListener('click', function() {
            if (mainVideo.paused) {
                mainVideo.play();
                videoPlaceholder.style.opacity = '0';
                setTimeout(() => {
                    videoPlaceholder.style.display = 'none';
                }, 300);
            }
        });
        
        // 视频播放时隐藏占位符
        mainVideo.addEventListener('play', function() {
            videoPlaceholder.style.opacity = '0';
            setTimeout(() => {
                videoPlaceholder.style.display = 'none';
            }, 300);
        });
        
        // 视频暂停时显示占位符
        mainVideo.addEventListener('pause', function() {
            videoPlaceholder.style.display = 'flex';
            setTimeout(() => {
                videoPlaceholder.style.opacity = '1';
            }, 10);
        });
    }
    
    // 服务介绍卡片切换功能
    const introCards = document.querySelectorAll('.intro-card');
    const totalServices = introCards.length;
    let currentServiceIndex = 0;

    // 显示指定索引的服务卡片
    const showServiceCard = (index) => {
        if (totalServices === 0) return;
        
        // 确保索引在有效范围内（循环）
        currentServiceIndex = (index + totalServices) % totalServices;
        
        // 隐藏所有卡片，只显示当前索引的卡片
        introCards.forEach((card, idx) => {
            if (idx === currentServiceIndex) {
                card.classList.add('active');
                card.style.display = 'block';
            } else {
                card.classList.remove('active');
                card.style.display = 'none';
            }
        });
    };

    // 初始化：显示第一个服务
    if (totalServices > 0) {
        showServiceCard(0);
    }

    // 为所有卡片的切换按钮添加事件监听
    introCards.forEach((card) => {
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showServiceCard(currentServiceIndex - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showServiceCard(currentServiceIndex + 1);
            });
        }
    });
    
    // 服务卡片点击事件
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // 可以跳转到服务详情页面
        });
    });
    
    // 新闻项点击事件
    const newsItems = document.querySelectorAll('.news-item, .news-featured');
    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            // 可以跳转到新闻详情页面
        });
    });
    
    // 联系我们按钮
    const contactBtns = document.querySelectorAll('.btn-primary');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const contactSection = document.querySelector('#contact');
            if (contactSection && !this.closest('#contact')) {
                const offsetTop = contactSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                alert('感谢您的关注！我们会尽快与您联系。');
            }
        });
    });
    
    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        // 确保页面加载时所有下拉菜单都是折叠状态
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        // 切换菜单显示
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = nav.classList.contains('active');
            
            if (isActive) {
                // 关闭菜单
                nav.classList.remove('active');
                this.querySelector('i').classList.remove('fa-times');
                this.querySelector('i').classList.add('fa-bars');
                
                // 关闭所有下拉菜单
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            } else {
                // 打开菜单
                nav.classList.add('active');
                this.querySelector('i').classList.remove('fa-bars');
                this.querySelector('i').classList.add('fa-times');
                
                // 确保打开菜单时所有下拉菜单都是折叠状态
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
        
        // 移动端下拉菜单点击展开
        const dropdowns = document.querySelectorAll('.nav .dropdown > a');
        
        dropdowns.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const dropdown = this.parentElement;
                    const isActive = dropdown.classList.contains('active');
                    
                    // 关闭其他下拉菜单
                    document.querySelectorAll('.nav .dropdown').forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    
                    // 切换当前下拉菜单 - 使用明确的方法
                    if (isActive) {
                        dropdown.classList.remove('active');
                    } else {
                        dropdown.classList.add('active');
                    }
                }
            });
        });
        
        // 点击菜单项后关闭移动端菜单（非下拉菜单父链接）
        const menuLinks = document.querySelectorAll('.nav a:not(.dropdown > a)');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    
                    // 关闭所有下拉菜单
                    document.querySelectorAll('.dropdown').forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
            });
        });
        
        // 窗口大小改变时重置下拉菜单状态
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth <= 768) {
                    // 移动端：确保所有下拉菜单折叠
                    document.querySelectorAll('.dropdown').forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                } else {
                    // 桌面端：关闭移动端菜单并移除active类
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    }
                    // 桌面端也要移除所有下拉菜单的active类
                    document.querySelectorAll('.dropdown').forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
            }, 250);
        });
        
        // 初始化时再次确保状态正确（只在页面加载时执行一次）
        let hasInitialized = false;
        if (!hasInitialized) {
            setTimeout(function() {
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
                hasInitialized = true;
            }, 100);
        }
    }
    
    // 统计数字动画
    const statTimers = new WeakMap();
    const stats = document.querySelectorAll('.statics-item h4');
    const animateValue = (element, start, end, duration) => {
        // 如果这个元素已有定时器，先清掉，防止多重定时器（目的：不加的话会产生BUG，即在数字未统计完成时滑走，再滑回来，统计完成后，数字会错乱）
        if (statTimers.has(element)) {
            clearInterval(statTimers.get(element));
        }

        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = element.textContent.replace(/\d+/, end);
                clearInterval(timer);
            } else {
                const value = Math.floor(current);
                element.textContent = element.textContent.replace(/\d+/, value);
            }
        }, 10);
        statTimers.set(element, timer);
    };
    
    // 当统计区域进入视口时触发动画
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItems = entry.target.querySelectorAll('.statics-item');
                statItems.forEach((item, index) => {
                    const h4 = item.querySelector('h4');
                    const text = h4.textContent;
                    const number = parseInt(text.match(/\d+/)[0]);
                    
                    setTimeout(() => {
                        animateValue(h4, 0, number, 2000);
                    }, index * 50);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    //业务类型添加进场动画
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
            // 进入视口：播放动画
            entry.target.classList.add('active');
            } else {
            // 离开视口：还原，下次进来重新动画
            entry.target.classList.remove('active');
            }
        });
        }, {
        threshold: 0.15
    });
    serviceItems.forEach(item => {
        serviceObserver.observe(item);
    });
    
    // 鼠标悬停效果增强
    const hoverElements = document.querySelectorAll('.service-card, .news-item, .partner-logo');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // 滚动指示器点击
    const scrollDown = document.querySelector('.scroll-down');
    if (scrollDown) {
        scrollDown.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const offsetTop = aboutSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    
    // 懒加载图片
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 窗口大小改变时的响应
window.addEventListener('resize', function() {
    const nav = document.querySelector('.nav');
    if (window.innerWidth > 768) {
        nav.style.display = 'flex';
    } else {
        nav.style.display = 'none';
    }
});

// 语言切换功能
document.addEventListener('DOMContentLoaded', function() {
    const langSwitcher = document.getElementById('langSwitcher');
    
    if (langSwitcher) {
        langSwitcher.addEventListener('click', function() {
            // 点击时提示英文站正在开发中
            alert('英文站开发中，敬请期待！\nEnglish site is under development, coming soon!');
        });
    }
});

//导航栏
customElements.define('site-nav', class extends HTMLElement {

    static get observedAttributes() {
        return ['pageNum'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const pageNum = this.getAttribute('pageNum')
        this.innerHTML = `<header class="header">
            <div class="container">
            <div class="logo">
                <a href="index.html">
                <img src="/attachment/20260203/9ecff4ca8ffa42d39b6067a1ea9b6265.png" alt="Worldplan">
                </a>
            </div>
            <nav class="nav">
                <ul>
                <li><a href="index.html" ${pageNum==='1'?'class="active"':''}>首页</a></li>
                <li><a href="about.html" ${pageNum==='5'?'class="active"':''}>关于我们</a></li>
                <li class="dropdown">
                    <a href="javascript:void(0)" ${pageNum==='2'?'class="active"':''}>业务类型</a>
                    <ul class="dropdown-menu">
                    <li><a href="businessDetails.html?type=0"><i class="fas fa-ship"></i><span>海运进出口</span></a></li>
                    <li><a href="businessDetails.html?type=1"><i class="fas fa-random"></i><span>多式联运</span></a></li>
                    <li><a href="businessDetails.html?type=2"><i class="fas fa-shopping-cart"></i><span>跨境电商</span></a></li>
                    <li><a href="businessDetails.html?type=3"><i class="fas fa-truck"></i><span>陆运业务</span></a></li>
                    <li><a href="businessDetails.html?type=4"><i class="fas fa-project-diagram"></i><span>供应链管理</span></a></li>
                    <li><a href="businessDetails.html?type=5"><i class="fas fa-plane-departure"></i><span>海空联运</span></a></li>
                    <li><a href="businessDetails.html?type=6"><i class="fas fa-warehouse"></i><span>综合物流保税</span></a></li>
                    <li><a href="businessDetails.html?type=7"><i class="fas fa-globe"></i><span>国际中转集拼</span></a></li>
                    <li><a href="businessDetails.html?type=8"><i class="fas fa-file-signature"></i><span>报关报检</span></a></li>
                    <li><a href="businessDetails.html?type=9"><i class="fas fa-boxes"></i><span>拼箱场站</span></a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="branch.html" ${pageNum==='3'?'class="active"':''}>分支机构</a>
                    <ul class="dropdown-menu dropdown-menu-wide">
                    <li><a href="branch.html?branch=0"><i class="fas fa-building"></i><span>万嘉旗舰</span></a></li>
                    <li><a href="branch.html?branch=1"><i class="fas fa-building"></i><span>万嘉通商</span></a></li>
                    <li><a href="branch.html?branch=2"><i class="fas fa-building"></i><span>万嘉威海</span></a></li>
                    <li><a href="branch.html?branch=3"><i class="fas fa-building"></i><span>万嘉烟台</span></a></li>
                    <li><a href="branch.html?branch=4"><i class="fas fa-building"></i><span>万嘉大连</span></a></li>
                    <li><a href="branch.html?branch=5"><i class="fas fa-building"></i><span>万嘉连云港</span></a></li>
                    <li><a href="branch.html?branch=6"><i class="fas fa-building"></i><span>万嘉厦门</span></a></li>
                    <li><a href="branch.html?branch=7"><i class="fas fa-building"></i><span>万嘉西安</span></a></li>
                    <li><a href="branch.html?branch=8"><i class="fas fa-building"></i><span>万嘉空运</span></a></li>
                    <li><a href="branch.html?branch=9"><i class="fas fa-building"></i><span>万嘉天津</span></a></li>
                    <li><a href="branch.html?branch=10"><i class="fas fa-building"></i><span>万嘉上海</span></a></li>
                    <li><a href="branch.html?branch=11"><i class="fas fa-building"></i><span>万嘉广州</span></a></li>
                    <li><a href="branch.html?branch=12"><i class="fas fa-building"></i><span>万嘉石家庄</span></a></li>
                    <li><a href="branch.html?branch=13"><i class="fas fa-building"></i><span>万嘉深圳</span></a></li>
                    <li><a href="branch.html?branch=14"><i class="fas fa-building"></i><span>万嘉洛杉矶</span></a></li>
                    <li><a href="branch.html?branch=15"><i class="fas fa-building"></i><span>万嘉宁波</span></a></li>
                    <li><a href="branch.html?branch=16"><i class="fas fa-building"></i><span>万嘉北京</span></a></li>
                    <li><a href="branch.html?branch=17"><i class="fas fa-building"></i><span>万嘉滨州</span></a></li>
                    <li><a href="branch.html?branch=18"><i class="fas fa-building"></i><span>万嘉成都</span></a></li>
                    <li><a href="branch.html?branch=19"><i class="fas fa-building"></i><span>万嘉湖南</span></a></li>
                    <li><a href="branch.html?branch=20"><i class="fas fa-building"></i><span>万嘉湖北</span></a></li>
                    <li><a href="branch.html?branch=21"><i class="fas fa-building"></i><span>万嘉重庆</span></a></li>
                    <li><a href="branch.html?branch=22"><i class="fas fa-building"></i><span>万嘉芝加哥</span></a></li>
                    <li><a href="branch.html?branch=23"><i class="fas fa-building"></i><span>万嘉纽约</span></a></li>
                    <li><a href="branch.html?branch=24"><i class="fas fa-building"></i><span>万嘉台北</span></a></li>
                    <li><a href="branch.html?branch=25"><i class="fas fa-building"></i><span>万嘉香港</span></a></li>
                    <li><a href="branch.html?branch=26"><i class="fas fa-building"></i><span>万嘉马来西亚</span></a></li>
                    <li><a href="branch.html?branch=27"><i class="fas fa-building"></i><span>万嘉新疆</span></a></li>
                    <li><a href="branch.html?branch=28"><i class="fas fa-building"></i><span>万嘉济南</span></a></li>
                    <li><a href="branch.html?branch=29"><i class="fas fa-building"></i><span>万嘉铁必达</span></a></li>
                    <li><a href="branch.html?branch=30"><i class="fas fa-building"></i><span>万嘉多伦多</span></a></li>
                    </ul>
                </li>
                <li><a href="newslist.html" ${pageNum==='4'?'class="active"':''}>新闻中心</a></li>
                <li><a href="contact.html" ${pageNum==='6'?'class="active"':''}>联系我们</a></li>
                <li><a href="online.html" ${pageNum==='7'?'class="active"':''}>运价查询</a></li>
                </ul>
            </nav>
            
            <div class="lang-switcher" id="langSwitcher">
                <span>中文/ENG</span>
            </div>
            <div class="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </div>
            </div>
        </header>`;
    }
})

//页脚
customElements.define('site-footer', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<footer class="footer">
    <div class="footer-leftView">
      <div class="footer-lineView" style="margin-top: unset;">
      <ul>
        <li><a style="color: var(--primary-color);">网站导航：</a></li>
        <li><a href="index.html">首  页</a></li>
        <li><a href="newslist.html">新闻中心</a></li>
        <li><a href="about.html">关于我们</a></li>
        <li><a href="contact.html">联系我们</a></li>
        <li><a href="online.html">运价查询</a></li>
      </ul>
      </div>
      <div class="footer-lineView">
      <ul>
        <li><a style="color: var(--primary-color);">业务类型：</a></li>
        <li><a href="businessDetails.html?type=0">海运进出口</a></li>
        <li><a href="businessDetails.html?type=1">多式联运</a></li>
        <li><a href="businessDetails.html?type=2">跨境电商</a></li>
        <li><a href="businessDetails.html?type=3">陆运业务</a></li>
        <li><a href="businessDetails.html?type=4">供应链管理</a></li>
        <li><a href="businessDetails.html?type=5">海空联运</a></li>
        <li><a href="businessDetails.html?type=6">综合物流保税</a></li>
        <li><a href="businessDetails.html?type=7">国际中转直拼</a></li>
        <li><a href="businessDetails.html?type=8">报关报检</a></li>
        <li><a href="businessDetails.html?type=9">拼箱场站</a></li>
      </ul>
      </div>
      <div class="footer-lineView">
      <ul>
        <li><a style="color: var(--primary-color);">分支机构：</a></li>
        <li><a href="branch.html?branch=0">万嘉旗舰</a></li>
        <li><a href="branch.html?branch=1">万嘉通商</a></li>
        <li><a href="branch.html?branch=2">万嘉威海</a></li>
        <li><a href="branch.html?branch=3">万嘉烟台</a></li>
        <li><a href="branch.html?branch=4">万嘉大连</a></li>
        <li><a href="branch.html?branch=5">万嘉连云港</a></li>
        <li><a href="branch.html?branch=6">万嘉厦门</a></li>
        <li><a href="branch.html?branch=7">万嘉西安</a></li>
        <li><a href="branch.html?branch=8">万嘉空运</a></li>
        <li><a href="branch.html?branch=9">万嘉天津</a></li>
        <li><a href="branch.html?branch=10">万嘉上海</a></li>
        <li><a href="branch.html?branch=11">万嘉广州</a></li>
      </ul>
      </div>
      <div class="footer-lineView">
      <ul>
        <li><a href="branch.html?branch=12">万嘉石家庄</a></li>
        <li><a href="branch.html?branch=13">万嘉深圳</a></li>
        <li><a href="branch.html?branch=14">万嘉洛杉矶</a></li>
        <li><a href="branch.html?branch=15">万嘉宁波</a></li>
        <li><a href="branch.html?branch=16">万嘉北京</a></li>
        <li><a href="branch.html?branch=17">万嘉滨州</a></li>
        <li><a href="branch.html?branch=18">万嘉成都</a></li>
        <li><a href="branch.html?branch=19">万嘉湖南</a></li>
        <li><a href="branch.html?branch=20">万嘉湖北</a></li>
        <li><a href="branch.html?branch=21">万嘉重庆</a></li>
        <li><a href="branch.html?branch=22">万嘉芝加哥</a></li>
        <li><a href="branch.html?branch=23">万嘉纽约</a></li>
        <li><a href="branch.html?branch=24">万嘉台北</a></li>
      </ul>
      </div>
      <div class="footer-lineView">
      <ul>
        <li><a href="branch.html?branch=25">万嘉香港</a></li>
        <li><a href="branch.html?branch=26">万嘉马来西亚</a></li>
        <li><a href="branch.html?branch=27">万嘉新疆</a></li>
        <li><a href="branch.html?branch=28">万嘉济南</a></li>
        <li><a href="branch.html?branch=29">万嘉铁必达</a></li>
        <li><a href="branch.html?branch=30">万嘉铁多伦多</a></li>
      </ul>
      </div>
      <div class="footer-leftView-longLine"></div>
      <div class="footer-lineView">
        <li><a style="color: var(--primary-color);">COPYRIGHT © 2026 万嘉通达物流有限公司  |  鲁ICP备20004002号</a></li>
      </div>
    </div>
    <div class="footer-rightView">
      <div class="footer-logoText">World Plan</div>
      <div class="footer-rightView-qr">
        <div class="qr-code">
          <img src="/attachment/20260203/e05c14f5ee3441119d618daa8ecde587.png" alt="微信公众号">
          <p>微信公众号</p>
        </div>
      </div>
    </div>
  </footer>`;
  }
})

