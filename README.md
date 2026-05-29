# Total Ótica — Linktree

Página estilo Linktree personalizada para a **Total Ótica**, com painel admin para gerenciar produtos.

## 📁 Estrutura

```
total-otica-linktree/
├── index.html          ← Página pública (Linktree)
├── admin.html          ← Painel administrativo
├── assets/
│   ├── video/
│   │   └── hero.mp4    ← ⚠️ Coloque aqui o vídeo gerado no Veo 3
│   ├── css/
│   │   ├── style.css   ← Estilos da página pública
│   │   └── admin.css   ← Estilos do painel admin
│   ├── js/
│   │   └── app.js      ← Lógica de produtos (localStorage)
│   └── img/            ← Imagens extras (opcional)
└── README.md
```

## 🚀 Como usar

1. **Clone o repositório**
   ```bash
   git clone https://github.com/SEU_USUARIO/total-otica-linktree.git
   cd total-otica-linktree
   ```

2. **Adicione o vídeo**  
   Copie o arquivo `.mp4` gerado no **Veo 3** para `assets/video/hero.mp4`

3. **Abra no navegador**  
   Abra o `index.html` diretamente no navegador ou use uma extensão como o **Live Server** no VS Code.

4. **Gerencie produtos**  
   Acesse `admin.html` para adicionar produtos com foto, preço e link WhatsApp.

## ⚙️ Funcionalidades

- 🎬 Vídeo de fundo cinematográfico (Veo 3)
- 👓 Aba **Links**: links fixos + produtos em destaque
- 🛍️ Aba **Shop**: galeria de produtos com botão WhatsApp
- ⚙️ **Admin panel**: CRUD completo de produtos
- 📸 Upload de fotos dos produtos
- ⭐ Marcar produto como destaque
- 💾 Dados salvos em `localStorage` (sem backend)

## 📱 Links fixos

| Link | Destino |
|------|---------|
| WhatsApp Atendimento | wa.me/5562993162521 |
| Agendar Exame de Vista | wa.me/5562993162521 |
| Instagram | @totaloticamais |
| Loja 1 | Av. Miguel João, 240 — Sala 03 |
| Loja 2 | Av. Xavier de Almeida, 115 — Centro |

## 🌐 Deploy

Para publicar gratuitamente, use:
- [Netlify Drop](https://app.netlify.com/drop) — arraste a pasta
- [Vercel](https://vercel.com) — conecte o GitHub
- [GitHub Pages](https://pages.github.com) — habilite nas configurações do repositório
