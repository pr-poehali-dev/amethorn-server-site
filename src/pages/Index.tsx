import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ====== ТИПЫ ======
type Page = "home" | "donate" | "connect" | "admin";

interface NewsItem {
  id: number;
  date: string;
  title: string;
  text: string;
}

interface DonateItem {
  id: number;
  name: string;
  price: number;
  color: string;
  features: string[];
  popular?: boolean;
}

// ====== НАЧАЛЬНЫЕ ДАННЫЕ ======
const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 1,
    date: "01.05.2026",
    title: "Открытие сервера!",
    text: "Добро пожаловать на Amethorn! Мы рады приветствовать первых игроков на нашем уникальном сервере. Вас ждут приключения, новые друзья и незабываемые моменты.",
  },
  {
    id: 2,
    date: "30.04.2026",
    title: "Обновление сборки v1.2",
    text: "Добавлены новые биомы, исправлены баги с фермами, улучшена производительность. Скачайте актуальную версию сборки!",
  },
];

const DEFAULT_DONATE: DonateItem[] = [
  {
    id: 1,
    name: "Искра",
    price: 49,
    color: "from-purple-950/80 to-purple-900/50",
    features: [
      "Префикс [Искра] в чате",
      "3 слота в /sethome",
      "Цветной ник",
    ],
  },
  {
    id: 2,
    name: "Аметист",
    price: 99,
    color: "from-purple-900/80 to-purple-800/50",
    features: [
      "Всё из «Искра»",
      "Префикс [Аметист] в чате",
      "Доступ к /fly везде",
      "5 слотов в /sethome",
    ],
  },
  {
    id: 3,
    name: "Аметрин",
    price: 199,
    color: "from-purple-800/80 to-violet-700/50",
    popular: true,
    features: [
      "Всё из «Аметист»",
      "Префикс [Аметрин]",
      "15 слотов в /sethome",
    ],
  },
  {
    id: 4,
    name: "Кристалл",
    price: 349,
    color: "from-violet-800/80 to-violet-700/50",
    features: [
      "Всё из «Аметрин»",
      "Префикс [Кристалл]",
      "Эффекты частиц вокруг игрока",
      "25 слотов в /sethome",
      "Доступ к закрытым ивентам",
    ],
  },
  {
    id: 5,
    name: "Аметрит",
    price: 499,
    color: "from-violet-700/80 to-purple-600/50",
    features: [
      "Всё из «Кристалл»",
      "Префикс [Аметрит] в чате",
      "Безлимитные /sethome",
    ],
  },
  {
    id: 6,
    name: "Легенда",
    price: 799,
    color: "from-fuchsia-900/80 to-purple-700/50",
    features: [
      "Всё из «Аметрит»",
      "Префикс [Легенда] золотом",
      "Уникальный ник-эффект",
      "Личный варп для друзей",
      "Приоритетная поддержка",
    ],
  },
];

// ====== ЧАСТИЦЫ ======
const Particles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    size: 3 + Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm opacity-0"
          style={{
            left: `${p.left}%`,
            bottom: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `rgba(${168 + Math.random() * 40}, ${85 + Math.random() * 40}, 247, 0.6)`,
            animation: `float-up ${p.duration}s ${p.delay}s ease-in infinite`,
            boxShadow: `0 0 ${p.size * 2}px rgba(168,85,247,0.8)`,
          }}
        />
      ))}
    </div>
  );
};

// ====== НАВИГАЦИЯ ======
const Nav = ({
  current,
  setPage,
}: {
  current: Page;
  setPage: (p: Page) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const links: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "donate", label: "Донат", icon: "Star" },
    { id: "connect", label: "Играть", icon: "Gamepad2" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-purple-900/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-purple-600 pixel-border flex items-center justify-center text-white font-minecraft text-sm">
            A
          </div>
          <span className="font-minecraft text-white text-lg group-hover:text-purple-400 transition-colors">
            AMETHORN
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              className={`nav-link font-body text-sm font-medium transition-colors ${
                current === l.id
                  ? "text-purple-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setPage("connect")}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-minecraft rounded pixel-border transition-all hover:scale-105 active:scale-95"
          >
            ИГРАТЬ
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-purple-900/50 px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setPage(l.id);
                setMenuOpen(false);
              }}
              className={`text-left font-body text-sm ${
                current === l.id ? "text-purple-400" : "text-gray-300"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

// ====== ФУТЕР ======
const Footer = () => (
  <footer className="mt-24 border-t border-purple-900/40 bg-black/60">
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-purple-700 pixel-border flex items-center justify-center text-white font-minecraft text-xs">
          A
        </div>
        <span className="font-minecraft text-gray-400 text-sm">AMETHORN</span>
      </div>

      <a
        href="https://discord.gg/xsbR4p5M7g"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-[#5865F2]/20 border border-[#5865F2]/40 hover:bg-[#5865F2]/30 text-[#a5b4fc] rounded transition-all group"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="group-hover:scale-110 transition-transform"
        >
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.912 19.912 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
        </svg>
        <span className="font-body text-sm">Discord сервер</span>
      </a>

      <p className="text-gray-600 text-xs font-body">
        © 2026 Amethorn. Все права защищены
      </p>
    </div>
  </footer>
);

// ====== ГЛАВНАЯ СТРАНИЦА ======
const HomePage = ({
  news,
  setPage,
}: {
  news: NewsItem[];
  setPage: (p: Page) => void;
}) => {
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/d811763f-d023-4683-afc5-e99ab149009b/files/148be91c-43dc-4ef0-87e7-067b820c91f4.jpg)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-purple-950/50 to-background" />
        <div className="absolute inset-0 bg-grid" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <span className="inline-block px-3 py-1 bg-purple-900/60 border border-purple-700/50 text-purple-300 text-xs font-minecraft rounded mb-6 pixel-border">
              ⚡ СЕРВЕР ОНЛАЙН
            </span>
          </div>

          <h1
            className="font-minecraft text-5xl md:text-7xl text-white amethyst-glow mb-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            AMETHORN
          </h1>

          <p
            className="font-body text-purple-200 text-lg md:text-xl mb-2 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            Уникальный Minecraft сервер с авторской сборкой
          </p>
          <p
            className="font-body text-gray-400 text-sm md:text-base mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
          >
            Магия, приключения и эпические сражения в мире аметистовых кристаллов
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
          >
            <button
              onClick={() => setPage("connect")}
              className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-minecraft rounded pixel-border-bright transition-all hover:scale-105 active:scale-95 text-sm"
            >
              НАЧАТЬ ИГРАТЬ
            </button>
            <button
              onClick={() => setPage("donate")}
              className="px-8 py-3.5 bg-black/50 hover:bg-purple-950/70 border border-purple-700/60 hover:border-purple-500 text-purple-300 hover:text-white font-minecraft rounded pixel-border transition-all hover:scale-105 text-sm"
            >
              ПРИВИЛЕГИИ
            </button>
          </div>

          {/* Stats */}
          <div
            className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
          >
            {[
              { val: "1.20", label: "Версия" },
              { val: "24/7", label: "Онлайн" },
              { val: "PvE", label: "Режим" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-black/50 border border-purple-900/50 rounded px-3 py-3 pixel-border"
              >
                <div className="font-minecraft text-purple-400 text-xl">
                  {s.val}
                </div>
                <div className="font-body text-gray-500 text-xs mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <Icon name="ChevronDown" size={24} className="text-purple-400" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <h2 className="font-minecraft text-center text-2xl md:text-3xl text-white mb-3 amethyst-glow">
          ОСОБЕННОСТИ СЕРВЕРА
        </h2>
        <p className="text-center text-gray-500 font-body text-sm mb-12">
          Что делает Amethorn уникальным
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "Gem",
              title: "Авторская сборка",
              text: "Уникальные моды и ресурсы, специально разработанные для нашего сервера",
              color: "text-purple-400",
            },
            {
              icon: "Shield",
              title: "Защита и стабильность",
              text: "Регулярные бекапы, защита от гриферов, стабильный аптайм 24/7",
              color: "text-violet-400",
            },
            {
              icon: "Users",
              title: "Сообщество",
              text: "Активный Discord, события, турниры и дружелюбные игроки",
              color: "text-fuchsia-400",
            },
            {
              icon: "Sword",
              title: "PvP арены",
              text: "Специальные зоны для PvP сражений с рейтингом и наградами",
              color: "text-purple-400",
            },
            {
              icon: "TreePine",
              title: "Открытый мир",
              text: "Огромная карта с уникальными биомами, данжами и секретами",
              color: "text-violet-400",
            },
            {
              icon: "Zap",
              title: "Регулярные обновления",
              text: "Постоянно добавляем контент, прислушиваемся к пожеланиям игроков",
              color: "text-fuchsia-400",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="bg-card border border-purple-900/40 rounded p-6 pixel-border hover:border-purple-700/60 transition-all group hover:-translate-y-1"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                className={`${f.color} mb-4 group-hover:scale-110 transition-transform inline-block`}
              >
                <Icon name={f.icon} size={28} />
              </div>
              <h3 className="font-minecraft text-white text-sm mb-2">
                {f.title}
              </h3>
              <p className="font-body text-gray-500 text-sm leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWS */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="font-minecraft text-center text-2xl md:text-3xl text-white mb-3 amethyst-glow">
          НОВОСТИ СЕРВЕРА
        </h2>
        <p className="text-center text-gray-500 font-body text-sm mb-12">
          Последние события и обновления
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, i) => (
            <div
              key={item.id}
              className="bg-card border border-purple-900/40 rounded p-6 pixel-border hover:border-purple-700/50 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-sm bg-purple-500 inline-block" />
                <span className="font-body text-purple-500 text-xs">
                  {item.date}
                </span>
              </div>
              <h3 className="font-minecraft text-white text-sm mb-2">
                {item.title}
              </h3>
              <p className="font-body text-gray-400 text-sm leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ====== СТРАНИЦА ДОНАТА ======
const DonatePage = ({ items }: { items: DonateItem[] }) => {
  return (
    <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 bg-purple-900/60 border border-purple-700/50 text-purple-300 text-xs font-minecraft rounded mb-4">
          ПОДДЕРЖИ СЕРВЕР
        </span>
        <h1 className="font-minecraft text-3xl md:text-5xl text-white amethyst-glow mb-4">
          ПРИВИЛЕГИИ
        </h1>
        <p className="font-body text-gray-400 max-w-lg mx-auto">
          Получи особый статус и уникальные возможности на сервере. Поддержи
          развитие Amethorn!
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            {item.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-0.5 bg-purple-600 text-white text-xs font-minecraft rounded pixel-border whitespace-nowrap">
                ★ ПОПУЛЯРНОЕ
              </div>
            )}
            <div
              className={`h-full bg-gradient-to-b ${item.color} border ${
                item.popular
                  ? "border-purple-500/70 pixel-border-bright"
                  : "border-purple-900/50 pixel-border"
              } rounded p-6 transition-all hover:-translate-y-1 hover:border-purple-500/60`}
            >
              <div className="mb-4">
                <Icon
                  name="Gem"
                  size={32}
                  className="text-purple-400 mb-3 group-hover:scale-110 transition-transform"
                />
                <h3 className="font-minecraft text-white text-xl mb-1">
                  {item.name}
                </h3>
                <div className="flex items-end gap-1">
                  <span className="font-minecraft text-purple-400 text-3xl">
                    {item.price}
                  </span>
                  <span className="font-body text-gray-400 text-sm mb-1">
                    руб/мес
                  </span>
                </div>
              </div>

              <div className="border-t border-purple-800/50 pt-4 mb-6">
                <ul className="space-y-2.5">
                  {item.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm font-body text-gray-300"
                    >
                      <span className="text-purple-400 mt-0.5 shrink-0">▪</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://www.donationalerts.com/r/amethorn?amount=${item.price}&message=Привилегия+${encodeURIComponent(item.name)}+на+сервере+Amethorn`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 bg-purple-700/60 hover:bg-purple-600 border border-purple-600/50 hover:border-purple-400 text-white font-minecraft text-sm rounded pixel-border transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                КУПИТЬ
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* How to buy */}
      <div className="bg-card border border-purple-700/40 rounded pixel-border max-w-2xl mx-auto overflow-hidden">
        <div className="bg-purple-900/30 px-6 py-3 border-b border-purple-800/40 flex items-center gap-2">
          <Icon name="ClipboardList" size={16} className="text-purple-400" />
          <span className="font-minecraft text-white text-sm">КАК ОФОРМИТЬ ПОКУПКУ</span>
        </div>
        <div className="p-6 space-y-4">
          {[
            { num: "1", text: "Нажми «Купить» — откроется страница DonationAlerts с нужной суммой" },
            { num: "2", text: <>В поле <span className="text-purple-300 font-minecraft text-xs">«Сообщение»</span> напиши свой ник в Minecraft</> },
            { num: "3", text: "Оплати удобным способом" },
            { num: "4", text: "Привилегия будет выдана в течение 5–15 минут после получения оплаты" },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-4">
              <span className="shrink-0 w-7 h-7 bg-purple-800/60 border border-purple-700/50 text-purple-300 font-minecraft text-xs flex items-center justify-center rounded-sm">
                {step.num}
              </span>
              <p className="font-body text-gray-300 text-sm leading-relaxed pt-0.5">{step.text}</p>
            </div>
          ))}
          <div className="mt-2 pt-4 border-t border-purple-900/40 flex items-start gap-2">
            <Icon name="MessageCircle" size={15} className="text-purple-500 shrink-0 mt-0.5" />
            <p className="font-body text-gray-500 text-xs">
              Если привилегия не выдана дольше 15 минут — напиши в{" "}
              <a href="https://discord.gg/xsbR4p5M7g" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">
                Discord
              </a>{" "}
              и приложи скриншот оплаты.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ====== СТРАНИЦА ПОДКЛЮЧЕНИЯ ======
const ConnectPage = () => {
  const [copied, setCopied] = useState(false);
  const serverIP = "play.amethorn.ru";

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIP).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-minecraft text-3xl md:text-5xl text-white amethyst-glow mb-4">
          КАК ЗАЙТИ
        </h1>
        <p className="font-body text-gray-400">
          Следуй инструкциям ниже, чтобы начать играть на Amethorn
        </p>
      </div>

      {/* IP Block */}
      <div className="bg-card border border-purple-700/50 rounded p-8 pixel-border-bright text-center mb-12 max-w-xl mx-auto animate-pulse-glow">
        <p className="font-body text-gray-500 text-sm mb-3 uppercase tracking-widest">
          IP адрес сервера
        </p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="font-minecraft text-purple-300 text-2xl md:text-3xl amethyst-glow">
            {serverIP}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`copy-btn flex items-center gap-2 mx-auto px-6 py-2.5 rounded font-minecraft text-sm transition-all pixel-border ${
            copied
              ? "bg-green-700/60 border-green-600/60 text-green-300"
              : "bg-purple-700/60 hover:bg-purple-600 border-purple-600/50 text-white"
          }`}
        >
          <Icon name={copied ? "Check" : "Copy"} size={14} />
          {copied ? "СКОПИРОВАНО!" : "СКОПИРОВАТЬ IP"}
        </button>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Steps list */}
        <div className="bg-card border border-purple-900/40 rounded p-6 pixel-border">
          <h2 className="font-minecraft text-white text-lg mb-6 flex items-center gap-2">
            <Icon name="ListChecks" size={18} className="text-purple-400" />
            КАК ЗАЙТИ
          </h2>
          <ol className="space-y-4">
            {[
              "Скачай и установи Minecraft Java Edition",
              "Скачай нашу авторскую сборку (кнопка ниже)",
              'Запусти Minecraft и нажми "Мультиплеер"',
              'Нажми "Добавить сервер" и введи наш IP',
              "Готово! Добро пожаловать на Amethorn 🎮",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 bg-purple-800/60 border border-purple-700/50 text-purple-300 font-minecraft text-xs flex items-center justify-center rounded-sm">
                  {i + 1}
                </span>
                <span className="font-body text-gray-300 text-sm leading-relaxed pt-0.5">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Download */}
        <div className="bg-card border border-purple-900/40 rounded p-6 pixel-border flex flex-col">
          <h2 className="font-minecraft text-white text-lg mb-6 flex items-center gap-2">
            <Icon name="Download" size={18} className="text-purple-400" />
            СБОРКА
          </h2>
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-purple-950/40 border border-purple-900/40 rounded p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-minecraft text-purple-300 text-sm">
                  Amethorn Pack v1.2
                </span>
                <span className="font-body text-gray-500 text-xs">
                  ~450 МБ
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Forge 1.20.1", "Оптимизация", "Авторские текстуры"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-purple-900/50 border border-purple-800/50 text-purple-400 text-xs font-body rounded"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
            <button className="w-full py-3 bg-purple-700/60 hover:bg-purple-600 border border-purple-600/50 hover:border-purple-400 text-white font-minecraft text-sm rounded pixel-border transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
              <Icon name="Download" size={16} />
              СКАЧАТЬ СБОРКУ
            </button>
            <p className="text-center text-gray-600 text-xs font-body mt-3">
              Также можно зайти с ванильным Minecraft 1.20.1
            </p>
          </div>
        </div>
      </div>

      {/* Technical info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "Server", label: "Порт", val: "25565" },
          { icon: "Cpu", label: "Версия", val: "1.20.1" },
          { icon: "Globe", label: "Режим", val: "Survival" },
          { icon: "Clock", label: "Аптайм", val: "24/7" },
        ].map((info) => (
          <div
            key={info.label}
            className="bg-card border border-purple-900/40 rounded p-4 pixel-border text-center"
          >
            <Icon
              name={info.icon}
              size={20}
              className="text-purple-500 mx-auto mb-2"
            />
            <div className="font-minecraft text-white text-lg">{info.val}</div>
            <div className="font-body text-gray-500 text-xs mt-0.5">
              {info.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ====== ПАНЕЛЬ АДМИНИСТРАТОРА ======
const AdminPage = ({
  news,
  setNews,
  donateItems,
  setDonateItems,
  serverIp,
  setServerIp,
}: {
  news: NewsItem[];
  setNews: (n: NewsItem[]) => void;
  donateItems: DonateItem[];
  setDonateItems: (d: DonateItem[]) => void;
  serverIp: string;
  setServerIp: (ip: string) => void;
}) => {
  const [tab, setTab] = useState<"news" | "donate" | "settings">("news");
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [editNews, setEditNews] = useState<NewsItem | null>(null);
  const [editDonate, setEditDonate] = useState<DonateItem | null>(null);

  const addNews = () => {
    if (!newTitle.trim() || !newText.trim()) return;
    const item: NewsItem = {
      id: Date.now(),
      date: new Date().toLocaleDateString("ru-RU"),
      title: newTitle,
      text: newText,
    };
    setNews([item, ...news]);
    setNewTitle("");
    setNewText("");
  };

  const deleteNews = (id: number) => {
    setNews(news.filter((n) => n.id !== id));
  };

  const saveDonateItem = (item: DonateItem) => {
    setDonateItems(donateItems.map((d) => (d.id === item.id ? item : d)));
    setEditDonate(null);
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-purple-700 pixel-border flex items-center justify-center">
          <Icon name="Settings" size={16} className="text-white" />
        </div>
        <h1 className="font-minecraft text-2xl text-white">
          ПАНЕЛЬ УПРАВЛЕНИЯ
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {(
          [
            { id: "news", label: "Новости", icon: "Newspaper" },
            { id: "donate", label: "Донат", icon: "Star" },
            { id: "settings", label: "Настройки", icon: "Settings2" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-minecraft text-xs transition-all pixel-border ${
              tab === t.id
                ? "bg-purple-700 text-white border-purple-500"
                : "bg-card text-gray-400 hover:text-white border-purple-900/40"
            }`}
          >
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* NEWS TAB */}
      {tab === "news" && (
        <div className="space-y-6">
          {/* Add news */}
          <div className="bg-card border border-purple-900/40 rounded p-6 pixel-border">
            <h2 className="font-minecraft text-white text-sm mb-4 flex items-center gap-2">
              <Icon name="Plus" size={14} className="text-purple-400" />
              ДОБАВИТЬ НОВОСТЬ
            </h2>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Заголовок новости"
              className="w-full bg-muted border border-purple-900/40 rounded px-3 py-2 text-white text-sm font-body mb-3 focus:outline-none focus:border-purple-600 placeholder:text-gray-600"
            />
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Текст новости"
              rows={3}
              className="w-full bg-muted border border-purple-900/40 rounded px-3 py-2 text-white text-sm font-body mb-3 focus:outline-none focus:border-purple-600 placeholder:text-gray-600 resize-none"
            />
            <button
              onClick={addNews}
              disabled={!newTitle.trim() || !newText.trim()}
              className="px-5 py-2 bg-purple-700/70 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed border border-purple-600/50 text-white font-minecraft text-xs rounded pixel-border transition-all"
            >
              ОПУБЛИКОВАТЬ
            </button>
          </div>

          {/* News list */}
          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-purple-900/40 rounded p-4 pixel-border"
              >
                {editNews?.id === item.id ? (
                  <div className="space-y-2">
                    <input
                      value={editNews.title}
                      onChange={(e) =>
                        setEditNews({ ...editNews, title: e.target.value })
                      }
                      className="w-full bg-muted border border-purple-900/40 rounded px-3 py-1.5 text-white text-sm font-body focus:outline-none focus:border-purple-600"
                    />
                    <textarea
                      value={editNews.text}
                      onChange={(e) =>
                        setEditNews({ ...editNews, text: e.target.value })
                      }
                      rows={2}
                      className="w-full bg-muted border border-purple-900/40 rounded px-3 py-1.5 text-white text-sm font-body focus:outline-none focus:border-purple-600 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNews(
                            news.map((n) =>
                              n.id === editNews.id ? editNews : n
                            )
                          );
                          setEditNews(null);
                        }}
                        className="px-3 py-1 bg-purple-700 text-white text-xs font-minecraft rounded pixel-border"
                      >
                        СОХРАНИТЬ
                      </button>
                      <button
                        onClick={() => setEditNews(null)}
                        className="px-3 py-1 bg-muted text-gray-400 text-xs font-minecraft rounded"
                      >
                        ОТМЕНА
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-purple-500 text-xs font-body mr-2">
                        {item.date}
                      </span>
                      <span className="font-minecraft text-white text-sm">
                        {item.title}
                      </span>
                      <p className="text-gray-500 text-xs font-body mt-1 line-clamp-1">
                        {item.text}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => setEditNews(item)}
                        className="p-1.5 bg-muted hover:bg-purple-900/40 rounded text-gray-400 hover:text-white transition-colors"
                      >
                        <Icon name="Pencil" size={12} />
                      </button>
                      <button
                        onClick={() => deleteNews(item.id)}
                        className="p-1.5 bg-muted hover:bg-red-900/40 rounded text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Icon name="Trash2" size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DONATE TAB */}
      {tab === "donate" && (
        <div className="space-y-4">
          {donateItems.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-purple-900/40 rounded p-5 pixel-border"
            >
              {editDonate?.id === item.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-500 text-xs font-body block mb-1">
                        Название
                      </label>
                      <input
                        value={editDonate.name}
                        onChange={(e) =>
                          setEditDonate({ ...editDonate, name: e.target.value })
                        }
                        className="w-full bg-muted border border-purple-900/40 rounded px-3 py-1.5 text-white text-sm font-body focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs font-body block mb-1">
                        Цена (руб/мес)
                      </label>
                      <input
                        type="number"
                        value={editDonate.price}
                        onChange={(e) =>
                          setEditDonate({
                            ...editDonate,
                            price: +e.target.value,
                          })
                        }
                        className="w-full bg-muted border border-purple-900/40 rounded px-3 py-1.5 text-white text-sm font-body focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs font-body block mb-1">
                      Возможности (по одной на строке)
                    </label>
                    <textarea
                      value={editDonate.features.join("\n")}
                      onChange={(e) =>
                        setEditDonate({
                          ...editDonate,
                          features: e.target.value
                            .split("\n")
                            .filter((f) => f.trim()),
                        })
                      }
                      rows={4}
                      className="w-full bg-muted border border-purple-900/40 rounded px-3 py-1.5 text-white text-sm font-body focus:outline-none focus:border-purple-600 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveDonateItem(editDonate)}
                      className="px-3 py-1.5 bg-purple-700 text-white text-xs font-minecraft rounded pixel-border"
                    >
                      СОХРАНИТЬ
                    </button>
                    <button
                      onClick={() => setEditDonate(null)}
                      className="px-3 py-1.5 bg-muted text-gray-400 text-xs font-minecraft rounded"
                    >
                      ОТМЕНА
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-minecraft text-white">
                        {item.name}
                      </span>
                      {item.popular && (
                        <span className="px-1.5 py-0.5 bg-purple-700/50 text-purple-300 text-xs font-body rounded">
                          популярное
                        </span>
                      )}
                    </div>
                    <div className="font-minecraft text-purple-400">
                      {item.price} руб/мес
                    </div>
                    <div className="text-gray-500 text-xs font-body mt-1">
                      {item.features.length} возможностей
                    </div>
                  </div>
                  <button
                    onClick={() => setEditDonate(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-purple-900/40 rounded text-gray-400 hover:text-white transition-all font-minecraft text-xs pixel-border"
                  >
                    <Icon name="Pencil" size={12} />
                    ИЗМЕНИТЬ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SETTINGS TAB */}
      {tab === "settings" && (
        <div className="bg-card border border-purple-900/40 rounded p-6 pixel-border">
          <h2 className="font-minecraft text-white text-sm mb-4">
            НАСТРОЙКИ САЙТА
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-500 text-xs font-body block mb-1 uppercase tracking-widest">
                IP адрес сервера
              </label>
              <div className="flex gap-2">
                <input
                  value={serverIp}
                  onChange={(e) => setServerIp(e.target.value)}
                  className="flex-1 bg-muted border border-purple-900/40 rounded px-3 py-2 text-white text-sm font-body focus:outline-none focus:border-purple-600"
                />
                <button className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-minecraft text-xs rounded pixel-border transition-all">
                  СОХРАНИТЬ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ====== СЕКРЕТНЫЙ ВХОД В АДМИНКУ ======
const AdminLogin = ({
  onLogin,
  onClose,
}: {
  onLogin: () => void;
  onClose: () => void;
}) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const ADMIN_PASS = "amethorn2026";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-card border border-purple-700/50 rounded p-8 pixel-border-bright w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-minecraft text-white text-lg">ВХОД В ПАНЕЛЬ</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <Icon name="X" size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Пароль"
            autoFocus
            className={`w-full bg-muted border rounded px-3 py-2 text-white text-sm font-body focus:outline-none transition-colors ${
              error
                ? "border-red-600 focus:border-red-500"
                : "border-purple-900/40 focus:border-purple-600"
            }`}
          />
          {error && (
            <p className="text-red-400 text-xs font-body">Неверный пароль</p>
          )}
          <button
            type="submit"
            className="w-full py-2.5 bg-purple-700 hover:bg-purple-600 text-white font-minecraft text-sm rounded pixel-border transition-all"
          >
            ВОЙТИ
          </button>
        </form>
      </div>
    </div>
  );
};

// ====== APP ======
const Index = () => {
  const [page, setPage] = useState<Page>("home");
  const [news, setNews] = useState<NewsItem[]>(DEFAULT_NEWS);
  const [donateItems, setDonateItems] = useState<DonateItem[]>(DEFAULT_DONATE);
  const [serverIp, setServerIp] = useState("play.amethorn.ru");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Secret admin access: click logo 5 times
  const [logoClicks, setLogoClicks] = useState(0);
  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) {
      setShowLogin(true);
      setLogoClicks(0);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLogoClicks(0), 3000);
    return () => clearTimeout(timer);
  }, [logoClicks]);

  return (
    <div className="min-h-screen bg-background text-foreground noise">
      <Particles />

      {/* Secret admin logo click zone */}
      <div
        className="fixed bottom-4 right-4 z-40 w-8 h-8 opacity-0 cursor-default"
        onClick={handleLogoClick}
      />

      {showLogin && (
        <AdminLogin
          onLogin={() => {
            setIsAdmin(true);
            setShowLogin(false);
            setPage("admin");
          }}
          onClose={() => setShowLogin(false)}
        />
      )}

      <Nav current={page} setPage={setPage} />

      <main className="relative z-10">
        {page === "home" && <HomePage news={news} setPage={setPage} />}
        {page === "donate" && <DonatePage items={donateItems} />}
        {page === "connect" && <ConnectPage />}
        {page === "admin" && isAdmin && (
          <AdminPage
            news={news}
            setNews={setNews}
            donateItems={donateItems}
            setDonateItems={setDonateItems}
            serverIp={serverIp}
            setServerIp={setServerIp}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;