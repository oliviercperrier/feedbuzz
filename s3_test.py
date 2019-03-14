import boto3
import base64
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAJPL6XE3LHXEDIEKA',
    aws_secret_access_key='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'
)

response = s3.get_bucket_acl(
    Bucket='feedbuzz'
)

print(response)