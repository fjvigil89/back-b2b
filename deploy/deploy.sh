apt update

apt install -y build-essential libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev

apt install -y python2.7 python-dev libpython-dev

# apt install -y python3 python3.4-dev

# Download install file pip
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

# Install pip3
#python3 get-pip.py

python2 get-pip.py

# Check version pip
# pip3 --version
pip2 --version

# pip3 install awsebcli
pip2 install awsebcli

# Configure credentias into enviroment
mkdir ~/.aws/
touch ~/.aws/credentials
printf "[eb-cli]\naws_access_key_id = %s\naws_secret_access_key = %s\n" "$AWS_ACCESS_KEY_ID" "$AWS_SECRET_ACCESS_KEY" >> ~/.aws/credentials
touch ~/.aws/config
printf "[profile eb-cli]\nregion=%s\noutput=json" "$AWS_EB_REGION" >> ~/.aws/config

# Check current directory
ls -al

# Checko if eb cli work
eb list -a

eb create back-b2b-production
