# rtalbot.github.io

Personal website and portfolio of Richard J Talbot.

**Live Site:** [https://rjtalbot.com](https://rjtalbot.com)

## About

This is a Jekyll-based static site hosted on GitHub Pages, featuring blog posts, projects, and portfolio work.

## Development Setup

For complete setup instructions from scratch, see [SETUP_GUIDE.md](SETUP_GUIDE.md).

### Quick Start

If you have Ruby and rbenv already set up:

```bash
cd ~/Code/rtalbot.github.io
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000 in your browser.

## Project Structure

- `_posts/` - Blog posts
- `_pages/` - Static pages (About, Projects)
- `_layouts/` - HTML templates
- `_includes/` - Reusable HTML components
- `_sass/` - SCSS stylesheets
- `_data/` - YAML data files
- `assets/` - Images, JavaScript, etc.

## Creating Content

### New Blog Post

Create a file in `_posts/` with format `YYYY-MM-DD-title.markdown`:

```markdown
---
layout: post
title: "Your Post Title"
tags: tag1, tag2
date: 2026-01-02
---

Your content here.
```

### New Page

Create a file in `_pages/` with appropriate front matter.

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `master` branch.

```bash
git add .
git commit -m "Your commit message"
git push origin master
```

## Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup instructions
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Common commands cheat sheet
- [RECOMMENDATIONS.md](RECOMMENDATIONS.md) - Improvement suggestions
- [UPDATE_CHECKLIST.md](UPDATE_CHECKLIST.md) - Update progress tracker

## Technology Stack

- **Jekyll** 4.3+ - Static site generator
- **Ruby** 3.1.4+ - Programming language
- **GitHub Pages** - Hosting
- **Sass** - CSS preprocessor

## License

See [LICENSE](LICENSE) file.

---

**Last Updated:** January 2026