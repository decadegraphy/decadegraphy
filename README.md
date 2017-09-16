# DecadeGraphy拍摄计划报名


## 约定

### css
> css中'dg-'开头为全局复用样式

### Dev Howto

#### run locally


```  
# Setup Virtualenv
virtualenv .env

# Active Virtualenv
source .env/bin/activate

# Install dependencies
pip3 install -r requirements/base.txt
pip3 install -r requirements/local.txt
npm install

# Setup Database
export DATABASE_URL=mysql://user:passwd@host:port/db # Note: create db with utf8mb4_unicode_ci character set.
python manage.py migrate

# Watch and build Front-end assets
npm run watch

# Start the development server
python manage.py runserver
```


### DATABASE

We use MySQL for now.


