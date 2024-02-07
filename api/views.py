import jwt, datetime
from django.shortcuts import render
from rest_framework.views import APIView, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.decorators import api_view
from .serializers import UserSerializer, ProductSerializer
from django.http import JsonResponse
from .models import User, Product
from rest_framework.parsers import MultiPartParser,FormParser
import tensorflow as tf
from PIL import Image
import numpy as np
print(tf.__version__)
mse = tf.keras.losses.MeanSquaredError()
def generator_loss(fake_output , real_y):
    real_y = tf.cast( real_y , 'float32' )
    return mse( fake_output , real_y )
img_size = 120
generator = tf.keras.models.load_model('generator_model.keras',custom_objects={'generator_loss':generator_loss})





# Create your views here.
class RegisterView(APIView):
    def post(self,request):
        serializer = UserSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']


        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        
        payload = {
            'id' : user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        #token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        response =  Response()

        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt' : token
        }
        
        return response
    

class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)

        # return Response(token)
    
class LogoutView(APIView):
    def post(self,request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message':'success'
        }
        return response
    

# class ImageView(APIView):
#     parser_classes = (MultiPartParser,FormParser)
#     def post(self, request, *args, **kwargs):
#         # products = Product.objects.all()
#         serializer = ProductSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

# class ColorizeImage(APIView):
#     def get(self,request)
    
class ImageView(APIView):
    def post(self, request):
        if request.FILES.get('image'):
            uploaded_image = request.FILES['image']
            uploaded_image_instance = Product(image=uploaded_image)
            uploaded_image_instance.save()
            
            # Get the uploaded image
            image_path = uploaded_image_instance.image.path
            image = Image.open(image_path) 
            
            # Colorize the image
            colorized_image = self.colorize(image)
            
            # Save the colorized image
            uploaded_image_instance.colorized_image.save('colorized_' + uploaded_image_instance.image.name, colorized_image)
            uploaded_image_instance.save()
            
            return JsonResponse({'colorized_image_url': uploaded_image_instance.colorized_image.url})
        
        return JsonResponse({'error': 'No image provided'}, status=400)
    
    def colorize(self,image):
        a =[]
        rgb = Image.open( image ).resize( ( img_size , img_size ) )
        # Normalize the RGB image array

        gray = rgb.convert( 'L' )
        # Normalize the grayscale image array
        gray_array = ( np.asarray( gray).reshape( ( img_size , img_size , 1 ) ) ) / 255
        # Append both the image arrays
        a.append( gray_array )
        output = generator(a[0:]).numpy()
        color_output = Image.fromarray((output[0]*255).astype('uint8')).resize((1024,1024))
        return color_output