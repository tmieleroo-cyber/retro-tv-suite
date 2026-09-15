import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Gamepad2,
  Heart,
  Home,
  Library,
  MonitorSmartphone,
  Play,
  RefreshCw,
  Search,
  Settings,
  Signal,
  Sparkles,
  Star,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import bosqueLunar from "@/assets/bosque-lunar.jpg";
import castilloNiebla from "@/assets/castillo-niebla.jpg";
import meteorRaid from "@/assets/meteor-raid.jpg";
import turboNeon from "@/assets/turbo-neon.jpg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RetroSala — Tus clásicos en la gran pantalla" },
      {
        name: "description",
        content: "Biblioteca de videojuegos retro para Smart TV con mandos Wi‑Fi.",
      },
      { property: "og:title", content: "RetroSala — Juegos retro en tu televisor" },
      {
        property: "og:description",
        content: "Explora clásicos de NES, SNES, Game Boy y GBA desde el sofá.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RetroSala,
});

type Sistema = "Todos" | "NES" | "SNES" | "Game Boy" | "GBA";

type Juego = {
  titulo: string;
  sistema: Exclude<Sistema, "Todos">;
  ano: number;
  genero: string;
  jugadores: string;
  imagen: string;
  progreso?: number;
  favorito?: boolean;
};

const juegos: Juego[] = [
  { titulo: "Meteor Raid", sistema: "SNES", ano: 1994, genero: "Disparos", jugadores: "1–2", imagen: meteorRaid, progreso: 68, favorito: true },
  { titulo: "Castillo de Niebla", sistema: "NES", ano: 1989, genero: "Aventura", jugadores: "1", imagen: castilloNiebla, progreso: 24 },
  { titulo: "Bosque Lunar", sistema: "Game Boy", ano: 1992, genero: "Exploración", jugadores: "1", imagen: bosqueLunar, favorito: true },
  { titulo: "Turbo Neón", sistema: "GBA", ano: 2002, genero: "Carreras", jugadores: "1–4", imagen: turboNeon, progreso: 41 },
];

const sistemas: { nombre: Sistema; cantidad: number; tono: string }[] = [
  { nombre: "Todos", cantidad: 48, tono: "bg-primary" },
  { nombre: "NES", cantidad: 12, tono: "bg-system-red" },
  { nombre: "SNES", cantidad: 15, tono: "bg-system-cyan" },
  { nombre: "Game Boy", cantidad: 9, tono: "bg-system-lime" },
  { nombre: "GBA", cantidad: 12, tono: "bg-system-yellow" },
];

function RetroSala() {
  const [sistema, setSistema] = useState<Sistema>("Todos");
  const [vista, setVista] = useState<"inicio" | "biblioteca" | "favoritos">("inicio");
  const [mandoAbierto, setMandoAbierto] = useState(false);
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [conectado, setConectado] = useState(false);
  const [codigo, setCodigo] = useState("7K4M");
  const mainRef = useRef<HTMLElement>(null);

  const visibles = useMemo(() => {
    return juegos.filter((juego) => {
      const coincideSistema = sistema === "Todos" || juego.sistema === sistema;
      const coincideVista = vista !== "favoritos" || juego.favorito;
      const coincideBusqueda = juego.titulo.toLowerCase().includes(consulta.toLowerCase());
      return coincideSistema && coincideVista && coincideBusqueda;
    });
  }, [consulta, sistema, vista]);

  useEffect(() => {
    const manejarTecla = (event: KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      const objetivo = event.target as HTMLElement;
      if (objetivo.tagName === "INPUT") return;
      const focos = Array.from(document.querySelectorAll<HTMLElement>("[data-tv-focus]:not([disabled])"));
      const actual = focos.indexOf(document.activeElement as HTMLElement);
      if (actual < 0) return;
      event.preventDefault();
      const columnas = window.innerWidth >= 1180 ? 4 : window.innerWidth >= 760 ? 2 : 1;
      const salto = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : event.key === "ArrowDown" ? columnas : -columnas;
      focos[Math.max(0, Math.min(focos.length - 1, actual + salto))]?.focus();
    };
    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, []);

  const cambiarVista = (nuevaVista: typeof vista) => {
    setVista(nuevaVista);
    setSistema("Todos");
    setConsulta("");
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="tv-shell min-h-screen bg-background text-foreground">
      <aside className="tv-sidebar">
        <div className="flex items-center gap-3 px-2">
          <div className="grid size-11 place-items-center rounded-md bg-primary text-primary-foreground shadow-glow">
            <Gamepad2 className="size-7" />
          </div>
          <div className="leading-none">
            <p className="font-display text-xl font-black uppercase">Retro<span className="text-primary">Sala</span></p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Modo salón</p>
          </div>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-2" aria-label="Navegación principal">
          <NavButton activo={vista === "inicio"} icono={Home} texto="Inicio" onClick={() => cambiarVista("inicio")} />
          <NavButton activo={vista === "biblioteca"} icono={Library} texto="Biblioteca" onClick={() => cambiarVista("biblioteca")} />
          <NavButton activo={vista === "favoritos"} icono={Heart} texto="Favoritos" onClick={() => cambiarVista("favoritos")} />
          <NavButton activo={mandoAbierto} icono={Gamepad2} texto="Mandos" onClick={() => setMandoAbierto(true)} />
        </nav>

        <div className="space-y-2 border-t border-border pt-5">
          <NavButton icono={Settings} texto="Ajustes" onClick={() => setMandoAbierto(true)} />
          <div className="flex items-center gap-3 px-3 pt-3 text-xs font-semibold text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            SISTEMA LISTO
          </div>
        </div>
      </aside>

      <main ref={mainRef} className="tv-main">
        <header className="flex items-center justify-between gap-4 px-5 pb-5 pt-6 sm:px-8 lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Martes, 15 de septiembre</p>
            <h1 className="mt-1 font-display text-3xl font-black sm:text-4xl">Buenas noches, Tejón</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button data-tv-focus variant="ghost" size="icon" aria-label="Buscar juegos" className="size-12 rounded-full border border-border bg-card" onClick={() => setBusquedaAbierta((valor) => !valor)}>
              {busquedaAbierta ? <X /> : <Search />}
            </Button>
            <Button data-tv-focus variant="ghost" size="icon" aria-label="Ayuda" className="hidden size-12 rounded-full border border-border bg-card sm:inline-flex">
              <CircleHelp />
            </Button>
            <Button data-tv-focus variant="outline" className="h-12 gap-3 border-primary/50 bg-primary/10 px-4 text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => setMandoAbierto(true)}>
              <Wifi className="size-5" /> <span className="hidden sm:inline">Conectar mando</span>
            </Button>
          </div>
        </header>

        {busquedaAbierta && (
          <div className="mx-5 mb-5 sm:mx-8 lg:mx-12">
            <label className="search-field">
              <Search className="size-5 text-muted-foreground" />
              <span className="sr-only">Buscar en la biblioteca</span>
              <input autoFocus value={consulta} onChange={(event) => setConsulta(event.target.value)} placeholder="Buscar por título…" className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground" />
              <span className="keycap">ESC</span>
            </label>
          </div>
        )}

        {vista === "inicio" && !consulta && (
          <section className="hero-game" aria-label="Juego destacado">
            <img src={meteorRaid} alt="Nave espacial entre meteoritos, arte de Meteor Raid" width={768} height={1024} className="absolute inset-0 size-full object-cover object-[center_64%]" />
            <div className="hero-shade" />
            <div className="relative z-10 max-w-2xl px-5 pb-10 pt-28 sm:px-8 sm:pb-12 lg:px-12 lg:pt-36">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="tag bg-system-cyan text-background">SNES</span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-hero-foreground"><Star className="size-4 fill-current text-system-yellow" /> 4,9</span>
                <span className="text-sm font-semibold text-hero-muted">1994 · Disparos · 1–2 jugadores</span>
              </div>
              <h2 className="font-display text-5xl font-black uppercase leading-[0.9] text-hero-foreground sm:text-7xl lg:text-8xl">Meteor<br /><span className="text-primary">Raid</span></h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-hero-muted sm:text-lg">Cruza el cinturón de Ícaro, rescata a la flota y supera tu récord. Tu partida continúa en el sector 7.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button data-tv-focus size="lg" className="h-14 px-7 text-base font-black uppercase" onClick={() => window.alert("Preparando Meteor Raid…")}><Play className="fill-current" /> Continuar</Button>
                <Button data-tv-focus size="lg" variant="outline" className="h-14 border-hero-foreground/30 bg-background/30 px-7 text-base text-hero-foreground backdrop-blur-md hover:bg-hero-foreground hover:text-background">Ver detalles <ChevronRight /></Button>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 z-10 hidden w-64 p-8 text-right lg:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-hero-muted">Progreso</p>
              <p className="font-display text-4xl font-black text-hero-foreground">68%</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hero-foreground/20"><div className="h-full w-[68%] bg-primary" /></div>
            </div>
          </section>
        )}

        <section className="px-5 py-8 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Colección</p>
              <h2 className="mt-1 font-display text-2xl font-black sm:text-3xl">{vista === "favoritos" ? "Tus favoritos" : vista === "biblioteca" ? "Biblioteca completa" : "Sigue jugando"}</h2>
            </div>
            <p className="hidden text-sm font-semibold text-muted-foreground sm:block">{visibles.length} juegos visibles</p>
          </div>

          <div className="scrollbar-none mt-6 flex gap-3 overflow-x-auto pb-3" role="tablist" aria-label="Filtrar por consola">
            {sistemas.map((item) => (
              <Button key={item.nombre} data-tv-focus role="tab" aria-selected={sistema === item.nombre} variant="outline" onClick={() => setSistema(item.nombre)} className={cn("h-12 shrink-0 gap-3 border-border bg-card px-5 text-sm font-black uppercase", sistema === item.nombre && "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")}>
                <span className={cn("size-2.5 rounded-sm", sistema === item.nombre ? "bg-primary-foreground" : item.tono)} />
                {item.nombre}<span className="font-medium opacity-60">{item.cantidad}</span>
              </Button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visibles.map((juego, indice) => <GameCard key={juego.titulo} juego={juego} destacado={indice === 0} />)}
          </div>
          {visibles.length === 0 && <div className="my-16 text-center text-muted-foreground">No hay juegos que coincidan con esta selección.</div>}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-6 text-xs font-semibold text-muted-foreground sm:px-8 lg:px-12">
          <span>48 juegos · 4 sistemas · 6 partidas guardadas</span>
          <span className="flex gap-4"><span><b className="keycap">↵</b> Elegir</span><span><b className="keycap">Esc</b> Volver</span></span>
        </footer>
      </main>

      <PairingDialog open={mandoAbierto} onOpenChange={setMandoAbierto} conectado={conectado} setConectado={setConectado} codigo={codigo} regenerar={() => setCodigo(Math.random().toString(36).slice(2, 6).toUpperCase())} />
    </div>
  );
}

function NavButton({ icono: Icono, texto, activo, onClick }: { icono: typeof Home; texto: string; activo?: boolean; onClick: () => void }) {
  return <Button data-tv-focus variant="ghost" onClick={onClick} className={cn("h-14 w-full justify-start gap-4 px-4 text-base font-bold text-muted-foreground hover:bg-accent hover:text-foreground", activo && "bg-primary/12 text-primary hover:bg-primary/15 hover:text-primary")}><Icono className="size-5" /> <span>{texto}</span>{activo && <span className="ml-auto size-1.5 rounded-full bg-primary" />}</Button>;
}

function GameCard({ juego, destacado }: { juego: Juego; destacado: boolean }) {
  return (
    <Button data-tv-focus variant="ghost" className="game-card group h-auto w-full flex-col items-stretch whitespace-normal p-0 text-left" onClick={() => window.alert(`Abriendo ${juego.titulo}…`)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-card">
        <img src={juego.imagen} alt={`Carátula de ${juego.titulo}`} width={768} height={1024} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105 group-focus-visible:scale-105" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background/90 to-transparent" />
        <span className="tag absolute left-3 top-3 bg-background/80 text-foreground backdrop-blur-md">{juego.sistema}</span>
        {juego.favorito && <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-background/80 text-system-red backdrop-blur-md"><Heart className="size-4 fill-current" /></span>}
        {juego.progreso && <div className="absolute inset-x-3 bottom-3"><div className="mb-1 flex justify-between text-[10px] font-bold text-hero-foreground"><span>PARTIDA</span><span>{juego.progreso}%</span></div><div className="h-1 overflow-hidden rounded-full bg-hero-foreground/30"><div className="h-full bg-primary" style={{ width: `${juego.progreso}%` }} /></div></div>}
        {destacado && <span className="absolute bottom-8 right-3 grid size-11 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-glow transition group-hover:opacity-100 group-focus-visible:opacity-100"><Play className="size-5 fill-current" /></span>}
      </div>
      <div className="px-1 pb-2 pt-3">
        <h3 className="font-display text-lg font-black leading-tight text-foreground sm:text-xl">{juego.titulo}</h3>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">{juego.ano} · {juego.genero} · {juego.jugadores} J</p>
      </div>
    </Button>
  );
}

function PairingDialog({ open, onOpenChange, conectado, setConectado, codigo, regenerar }: { open: boolean; onOpenChange: (open: boolean) => void; conectado: boolean; setConectado: (valor: boolean) => void; codigo: string; regenerar: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-border bg-card p-0 text-foreground shadow-panel sm:rounded-lg [&>button]:hidden">
        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="p-7 sm:p-9">
            <DialogHeader>
              <div className="mb-5 flex items-center justify-between">
                <div className="grid size-14 place-items-center rounded-md bg-primary text-primary-foreground shadow-glow"><MonitorSmartphone className="size-7" /></div>
                <Button data-tv-focus variant="ghost" size="icon" aria-label="Cerrar" className="size-11 rounded-full" onClick={() => onOpenChange(false)}><X /></Button>
              </div>
              <DialogTitle className="font-display text-3xl font-black">Usa tu móvil como mando</DialogTitle>
              <DialogDescription className="pt-2 text-base leading-relaxed">Conecta el teléfono a la misma red Wi‑Fi y abre la dirección indicada.</DialogDescription>
            </DialogHeader>
            <ol className="mt-8 space-y-5">
              <Paso numero="1" titulo="Abre el navegador" texto="Entra en retrosala.local desde tu móvil." />
              <Paso numero="2" titulo="Introduce el código" texto="El código caduca dentro de 4:32 minutos." />
              <Paso numero="3" titulo="Empieza a jugar" texto="Usa la pantalla táctil como mando inalámbrico." />
            </ol>
          </div>
          <div className="flex flex-col justify-between bg-secondary p-7 sm:p-9">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-primary"><Signal className="size-4" /> RED RETRO_SALA_5G</div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Código de conexión</p>
              <div className="my-3 flex gap-2" aria-label={`Código ${codigo.split("").join(" ")}`}>
                {codigo.split("").map((letra, indice) => <span key={`${letra}-${indice}`} className="code-cell">{letra}</span>)}
              </div>
              <p className="font-mono text-sm text-muted-foreground">retrosala.local</p>
            </div>
            <div className="mt-10 space-y-3">
              <div className={cn("flex items-center gap-3 rounded-md border p-4", conectado ? "border-primary/50 bg-primary/10" : "border-border bg-background/40")}>
                <div className={cn("grid size-10 place-items-center rounded-full", conectado ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{conectado ? <Check /> : <Gamepad2 />}</div>
                <div><p className="font-bold">Jugador 1</p><p className="text-xs text-muted-foreground">{conectado ? "Mando móvil conectado" : "Esperando conexión…"}</p></div>
              </div>
              <Button data-tv-focus className="h-12 w-full font-bold" onClick={() => setConectado(!conectado)}>{conectado ? "Desconectar mando" : "Simular conexión"}</Button>
              <Button data-tv-focus variant="outline" className="h-12 w-full font-bold" onClick={regenerar}><RefreshCw /> Generar otro código</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Paso({ numero, titulo, texto }: { numero: string; titulo: string; texto: string }) {
  return <li className="flex gap-4"><span className="grid size-8 shrink-0 place-items-center rounded-full border border-primary/50 text-sm font-black text-primary">{numero}</span><div><p className="font-bold">{titulo}</p><p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{texto}</p></div></li>;
}