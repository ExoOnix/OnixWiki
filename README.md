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

### Run without docker

#### 0.
Install Laravel dependancies: 
https://laravel.com/docs/12.x/installation

#### 1.

Setup env based on .env.example. Set your database settings in the env.

#### 2.
```
composer install
php artisan key:generate
```

#### 3.
```
php artisan migrate
```

#### 4.
```
php artisan db:seed --class BouncerSeeder
php artisan db:seed
```

#### 5.

```
npm install && npm run build
composer run dev
```

#### 6.

You can now access the wiki with the created admin account with the following credentials:
```
Email: admin@example.com
Password: password
```


### Run with sail

#### 0.
Install Laravel dependancies: 
https://laravel.com/docs/12.x/installation

#### 1.

Setup env based on .env.example. Set your database settings in the env.

#### 2.
```
composer i
```

#### 3.
```
./vendor/bin/sail up -d
```
#### 4.
```
./vendor/bin/sail artisan key:generate
```
#### 5.
```
./vendor/bin/sail artisan migrate
```
#### 6.
```
./vendor/bin/sail artisan db:seed --class BouncerSeeder
./vendor/bin/sail artisan db:seed
```
#### 7.
```
./vendor/bin/sail npm i
./vendor/bin/sail npm run dev
```
#### 8.

You can now access the wiki with the created admin account with the following credentials:
```
Email: admin@example.com
Password: password
```
To stop run `./vendor/bin/sail down`
## Production Build

For production deployment, use the provided nixpack and connect env variables to a external db.

---

## License & Usage

MIT License
