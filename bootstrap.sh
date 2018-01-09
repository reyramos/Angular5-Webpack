#!/usr/bin/env bash

apt-get update
#Install packages
sudo apt-get install apache2 php aptitude libapache2-mod-php php-mcrypt php-mysql -y

#Change the path of apache to serve root directory
if ! [ -L /var/www/html ]; then
  rm -rf /var/www/html
  ln -fs /vagrant /var/www/html
fi

## Create shortcuts to development
ln -s /vagrant development


sudo apt-get install -y openssl => /dev/null
sudo a2enmod rewrite => /dev/null

###NODE JS
cd /tmp
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
apt-get install nodejs -y
sudo apt-get install build-essential libssl-dev tcl -y


##MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
#copy the file from mongo.service to systemctl
cp /vagrant/mongodb.service /lib/systemd/system/mongodb.service
#copy the conf, we change the bindIp to be accessible through host
cp /vagrant/mongod.conf /etc/mongod.conf
sudo systemctl start mongod


## Install Composer
sudo apt-get install curl php-cli php-mbstring git unzip -y
cd ~
curl -sS https://getcomposer.org/installer -o composer-setup.php
php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer

