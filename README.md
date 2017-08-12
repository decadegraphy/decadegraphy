### Dev Howto

#### run locally

```

export DATABASE_URL=mysql://user:passwd@host:port/db
python manage.py migrate
python manage.py runserver
```

Note: create db with utf8mb4_unicode_ci character set.

### DATABASE

We use MySQL for now.


