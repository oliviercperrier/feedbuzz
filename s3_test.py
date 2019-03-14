import boto3
import base64
s3 = boto3.resource(
    's3',
    aws_access_key_id='AKIAJPL6XE3LHXEDIEKA',
    aws_secret_access_key='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'
)

response = s3.Bucket(
    'feedbuzz'
)


for object in response.objects.all():
    print(object)

print(response)
