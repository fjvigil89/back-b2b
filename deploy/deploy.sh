apt install -y python3 python3-setuptools

# Download install file pip
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

# Install pip3
python3 get-pip.py

# Check version pip
pip3 --version

# Configure credentias into enviroment
mkdir ~/.aws/
touch ~/.aws/credentials
printf "[eb-cli]\naws_access_key_id = %s\naws_secret_access_key = %s\n" "$AWS_ACCESS_KEY_ID" "$AWS_SECRET_ACCESS_KEY" >> ~/.aws/credentials
touch ~/.aws/config
printf "[profile eb-cli]\nregion=%s\noutput=json" "$AWS_EB_REGION" >> ~/.aws/config

# Check current directory
ls

# Checko if eb cli work
eb list -a

# eb deploy back-b2b-production
