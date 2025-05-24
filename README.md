# OnixWiki

<div align="center">
  <a href="https://github.com/ExoOnix/OnixWiki">
    <img src="https://img.shields.io/github/stars/ExoOnix/OnixWiki?style=for-the-badge" alt="GitHub stars" />
  </a>
  <a href="https://github.com/ExoOnix/OnixWiki/fork">
    <img src="https://img.shields.io/github/forks/ExoOnix/OnixWiki?style=for-the-badge" alt="GitHub forks" />
  </a>
  <a href="https://github.com/ExoOnix/OnixWiki/issues">
    <img src="https://img.shields.io/github/issues/ExoOnix/OnixWiki?style=for-the-badge" alt="GitHub issues" />
  </a>
<a href="https://opensource.org/license/mit">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey.svg?style=for-the-badge" alt="MIT License" />
</a>
</div>

OnixWiki is a wiki system with an editor, permission system, and admin.

### Key Features

- **Page system**: Includes a page system with pages which can be created.
- **Editor**: Includes a block editor with varius block types.
- **Robust Permission system**: Manage wiki-wide permissions and also manage per page permissions.
- **Administration**: Includes users and roles managment administration panels.
---


## Local Development Setup
To get started with local development use sail.

```
sail up -d

sail artisan migrate

sail artisan db:seed --class BouncerSeeder

sail npm run dev
```



## Production Build

For production deployment, use the provided nixpack and connect env variables to a external db.

---

## License & Usage

MIT License
