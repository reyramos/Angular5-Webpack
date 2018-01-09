#@IgnoreInspection BashAddShebang
# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.

#if !Vagrant.has_plugin?("vagrant-proxyconf")
#   system('vagrant plugin install vagrant-proxyconf')
#   raise("vagrant-proxyconf installed. Run command again.");
#end

Vagrant.configure("2") do |config|

  #if Vagrant.has_plugin?("vagrant-proxyconf")
  #  config.proxy.http     = "http://localhost:9998/"
  #  config.proxy.https    = "http://localhost:9998/"
  #  config.proxy.no_proxy = "localhost,127.0.0.1"
  #end

  config.vm.box = "ubuntu/xenial64"
  config.vm.box_check_update = true

  config.vm.provision :shell, path: "bootstrap.sh"

  config.vm.network :forwarded_port, guest: 80, host: 8080

  # node/socket port for application
  #config.vm.network :forwarded_port, guest: 9998, host: 9998

  # webpack-serve-dev port
  config.vm.network :forwarded_port, guest: 3000, host: 3000

  config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
    vb.memory = "1524"
  end
  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update
  #   apt-get install -y apache2
  # SHELL


end
