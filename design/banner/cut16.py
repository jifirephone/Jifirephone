from PIL import Image
import numpy as np, cv2
im=Image.open('i16_raw.jpg').convert('RGB'); a=np.array(im).astype(int); h,w=a.shape[:2]
R,G,B=a[...,0],a[...,1],a[...,2]
mn=a.min(2); mx=a.max(2)
# background = bright & near-neutral (white / light-grey shadow)
bg=((mn>232)&((mx-mn)<14)).astype(np.uint8)
# flood from borders so interior light phone parts aren't removed
ff=bg.copy(); mask=np.zeros((h+2,w+2),np.uint8)
inv=(1-ff).astype(np.uint8)  # 0=bg candidate
# connected-component of bg touching border
n,lab=cv2.connectedComponents(bg)
border=set(lab[0,:]).union(lab[-1,:]).union(lab[:,0]).union(lab[:,-1]); border.discard(0)
outside=np.isin(lab,list(border))
alpha=np.where(outside,0,255).astype(np.uint8)
# clean + feather
alpha=cv2.medianBlur(alpha,5)
alpha=cv2.morphologyEx(alpha,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
alpha=cv2.GaussianBlur(alpha,(0,0),1.2)
rgba=np.dstack([a.astype(np.uint8),alpha])
ys,xs=np.where(alpha>40); pad=6
x0,y0,x1,y1=max(0,xs.min()-pad),max(0,ys.min()-pad),min(w,xs.max()+pad),min(h,ys.max()+pad)
Image.fromarray(rgba[y0:y1,x0:x1]).save('iphone16.png'); print('saved',x1-x0,y1-y0)
