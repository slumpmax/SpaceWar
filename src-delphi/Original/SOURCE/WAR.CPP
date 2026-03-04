#include "xgraph.cpp"
#include "wardata.cpp"
BYTE far *Rocket1,far *Rocket2,far *MyGun;
char map[] = {
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,2,1,2,1,1,2,1,1,2,1,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,1,2,2,2,1,
    2,2,2,2,1,2,2,2,2,6,2,1,2,2,6,9,2,2,1,2,6,2,2,6,1,2,1,6,2,2,6,
    2,6,2,6,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6,2,2,1,6,6,1,1,2,6,2,
    6,2,2,1,6,1,6,2,2,1,2,1,6,2,2,10,6,1,2,2,2,2,6,2,2,2,2,6,2,2,6,
    2,6,2,2,6,2,1,2,1,2,6,2,2,2,6,1,2,2,6,2,2,6,2,2,2,2,1,2,6,2,2,
    2,6,2,2,1,2,6,2,2,2,6,2,1,6,9,2,6,2,2,2,2,6,2,6,2,6,2,2,2,6,1,
    1,2,6,2,2,6,2,2,3,6,2,2,6,1,2,2,2,2,2,2,2,2,2,6,1,2,6,2,2,1,2,
    2,1,1,6,3,2,2,6,2,2,6,2,1,2,6,3,2,2,6,2,2,2,6,3,6,2,2,2,6,2,2,
    2,6,3,2,6,2,2,2,6,2,3,2,6,2,2,6,2,2,2,3,2,2,6,2,2,3,6,2,2,2,6,
    3,2,2,6,2,2,2,6,3,2,2,6,2,2,3,10,2,2,2,2,2,2,3,6,2,2,2,6,2,6,2,
    2,6,2,2,2,6,2,2,6,3,2,2,6,2,2,6,2,3,6,2,2,6,2,2,6,2,6,3,6,2,2,
    2,6,3,2,2,6,2,6,3,2,6,2,2,2,6,3,6,2,2,2,3,2,2,6,2,6,3,6,2,2,2,
    3,6,2,6,2,2,6,3,2,2,2,6,3,6,2,3,2,2,3,2,2,3,6,3,1,3,6,2,6,2,2,
    1,1,1,1,1,1,6,3,6,2,6,2,3,2,6,9,2,3,2,6,2,3,2,2,6,3,2,3,6,2,2,
    1,2,6,2,3,2,3,6,2,1,3,2,3,1,6,2,3,2,3,3,2,3,6,2,6,3,3,3,6,2,3,
    6,3,2,3,3,6,2,6,3,2,1,6,3,3,6,1,3,6,1,1,6,1,2,2,6,3,2,3,1,6,2,
    11};
char Num[20] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
int yy[20], xx[20], s[20], d[20];
int count = 200;
unsigned long ss[] = {500,75,2000,15,7000000,0,100000,0,0,0,10000,300000,10000000};
BYTE far *pptr[16];
char far *mptr;
/* variable
   Num[]     enermy
   xx[],yy[] current position of put enermy sprite
   s[],d[]   help
   ss[]      score for enermy type
   *pptr[]   address of enermy type
   *mptr     address of enermy map (enermy type,delay time)
*/
int p=0,bomb=3,power,state=0,life=3,x,y,xold,yold,god=200,shoot,gunx,guny,NClr[2]={0,0},x0[2][23],y0[2][23];
unsigned long Score = 0;
BYTE far *ptr0[2][23];
/* variable
   x,y       current position of put rocket sprite
   xold,yold old position of put rocket sprite
   god       if != 0 then rocket not dead
   p         current page for display
   shoot     gun status
   gunx,guny current position of put gun sprite
   NClr      array for number of sprite on screen
   x0,y0     array for current position of sprite from NClr
   ptr0      array for address of sprite from NClr
   Score     your score
   bomb      number of your bomb
   power     power of your rocket
   state     now state
   life      number of your rocket
*/
#define WriteScore(x) PutPara(67,55,41,18,x,10);
#define WriteBomb(x) PutPara(80,79,41,18,x,2);
#define WriteLife(x) PutPara(81,179,41,18,x,2);
void PrintChar(int p, int y, BYTE color, BYTE ch)
{   /* put number on screen */
    long *ptr0 = (long *)MK_FP(0, 0x10c);
    char *ptr1 = (char *)(*ptr0 + ch * 8), *ptr2 = PageStart + LINE_Y[y] + p;
    int d, sizey = 8;
    BYTE e = 0, f;
    for(; sizey > 0; sizey--, y++, ptr2 += 90) {
	for(f = *ptr1++, d = 8; d > 0; f >>= 1, d--)
	    e += e + (f & 1);
	outport(0x3c4, ((e & 15) << 8) | 2);
	*ptr2 = color;
	outport(0x3c4, ((e & 240) << 4) | 2);
	*(ptr2 + 1) = color;
    }
}
void PutNumber(int p, int y, BYTE cf, BYTE cb, unsigned long Num, int len)
{   /* print score by foreground cf and background cb */
    int i = 0, j = 0;
    char far *ptr = PageStart + LINE_Y[y] + p;
    outport(0x3c4, 0xf02);
    len <<= 1;
    for(; j < 8; j++, ptr += 90 - len)
	for(i = len; i; i--)
	    *ptr++ = cb;
    for(i = 0, p += len - 2; len; p -= 2, Num /= 10, len -= 2)
	PrintChar(p, y, cf, '0' + Num % 10);
}
void PutPara(int pp, int y, BYTE cf, BYTE cb, unsigned long N, int len)
{   /* write parameter */
    int i = PageStart == FirstAdr[0]? 0: 1;
    PutNumber(pp, y, cf, cb, N, len);
    CopyPot(pp,y,pp+(len-1<<1)+1,y+7,i,pp,y,1-i);
}
void PutPlane(int x0, int y0, BYTE far *ptr, BYTE color)
{   /* put sprite by one color to active page */
    int sizex = *ptr++ + x0, sy = *ptr, sizey = sy + y0;
    BYTE far *A, far *B = PageStart + y0 * 90;
    for(; x0 < sizex; x0++) {
	if(In(x0, XMIN, XMAX)) {
	    A = B + (x0 >> 2);
	    asm push word ptr y0;
	    outport(0x3c4, POT_X[x0]);
	    for(; y0 < sizey; y0++, A += 90)
		if(*(++ptr) && In(y0, YMIN, YMAX)) *A = color;
	    asm pop word ptr y0;
	} else ptr += sy;
    }
}
void PutSpr(int x, int y, BYTE far *ptr)
{   /* put sprite and save aray for clear screen */
    PutSprite(x, y, ptr);
    x0[p][NClr[p]] = x;
    y0[p][NClr[p]] = y;
    ptr0[p][NClr[p]] = ptr;
    NClr[p]++;
}
void PutPln(int x, int y, BYTE far *ptr)
{   /* put sprite by one color and save aray for clear screen */
    PutPlane(x, y, ptr, 15);
    x0[p][NClr[p]] = x;
    y0[p][NClr[p]] = y;
    ptr0[p][NClr[p]] = ptr;
    NClr[p]++;
}
void ClrSprite(int x, int y, BYTE far *ptr)
{   /* clear back ground sprite */
    int i = x + *ptr++ - 1, j = y + *ptr - 1;
    BYTE far *ptr0;
    if(i < XMIN || x > XMAX || j < YMIN || y > YMAX) return;
    if(x < XMIN) x = XMIN;
    if(i > XMAX) i = XMAX;
    if(y < YMIN) y = YMIN;
    if(j > YMAX) j = YMAX;
    i = (i >> 2) - (x >>= 2) + 1;
    outport(0x3c4, 0x0f02);
    ptr0 = PageStart + LINE_Y[y] + x;
    asm CLD;
    for(; y <= j; y++, ptr0 += 90) {
	asm {
	    LES     DI,ptr0
	    MOV     CX,i
	    MOV	    AL,0
	    REP     STOSB
	}
    }
}
void PutStar()
{   /* draw black ground star */
    static int y = 0, a[20];
    int i, j, p, *ptr = a;
    outport(0x3c4, 0x402);
    for(i = 0; i < 240; i += 12) {
	if((j = i + y) > 241) j -= 242;
	if(!j) *ptr = random((XMAX >> 2) + 1);
	p = *ptr++;
	if(j > 1) *(PageStart + LINE_Y[j - 2] + p) = 0;
	if(j < 240) *(PageStart + LINE_Y[j] + p) = 110;
    }
    y++;
    if(y > 241) y -= 242;
}
void ShowPow()
{   /* Show power */
    int i,j;
    outport(0x3c4, 0xf02);
    for(j=132;j<138;j++)
	for(i=0;i<10;i++)
	    *(FirstAdr[0]+LINE_Y[j]+71+i) = 0;
    outport(0x3c4, 0x702);
    for(j=132;j<138;j++)
	for(i=0;i<power-(power==11);i++)
	    *(FirstAdr[0]+LINE_Y[j]+71+i) = 123;
    CopyPot(71,132,80,137,0,71,132,1);
}
void Gun(void)
{   /* check and draw gun */
    if(!(shoot |= KEY[29]) || power < 0) return;
    if(shoot==1) {shoot=2;gunx=x+10;guny=y+14;}
    if((guny-=20)<-10) shoot=0;
    PutSpr(gunx,guny,MyGun);
    if(guny!=y-6) PutSpr(gunx,guny+10,MyGun);
}
BYTE Hit(int i)
{   /* return 1 when gun hit sprite */
    return(shoot && In(gunx,xx[i]-3,xx[i]+1+*pptr[Num[i]-1]) && In(guny,yy[i]-20,yy[i]+*(pptr[Num[i]-1]+1)));
}
BYTE Beat(int i)
{   /* return 1 when rocket hit sprite */
    return(power>=0 && In(x+10,xx[i]-6,xx[i]+*pptr[Num[i]-1]) && In(y+10,yy[i]-6,yy[i]+*(pptr[Num[i]-1]+1)));
}
BYTE PutEnermy()
{   /* return 1 when state clear */
    int i, j;
    static int k = 0;
    BYTE hurt = 0; /* 1 when rocket hurt */
    for(i = 0; i < 20; i++) {
      if(Num[i] > 0) {
	if(Out(yy[i],-50,239) || Out(xx[i],-50,359)) {
	    if(Out((int)Num[i],11,13)) { Num[i] = 0; continue; }
	    else { for(j=1;j<20;j++) if(Num[j]) break;
		if(j==20) {
		    WriteScore(Score += ss[Num[i]-1]);
		    return(1);
		}
	    }
	}
	if(Num[i] < 11) PutSpr(xx[i], yy[i], pptr[Num[i]-1]);
	if(Num[i] == 6) {
	    if(Hit(i)) shoot = 0;
	    if(Beat(i)) { x = xold; y = yold += 2; }
	    yy[i]++;
	} else if(Num[i] == 7 && s[i] && !(hurt = Beat(i))) {
	    if(!random(100))
		for(j = 0; j < 20; j++)
		    if(!Num[j]) {
			Num[j] = 4;
			xx[j] = xx[i] + 3;
			yy[j] = yy[i] + 8;
			if(abs(x-xx[j])>abs(y-yy[j])) {
			    s[j] = 2; d[j] = 1;
			} else { s[j] = 1; d[j] = 2; }
			if(x<xx[j]) s[j] = -s[j];
			if(y<yy[j]) d[j] = -d[j];
			break;
		    }
	    if(Hit(i)) { s[i]--; yy[i] -= 6; shoot = 0; }
	    yy[i]++;
	} else if(Num[i] == 8) {
	    if(!god && Beat(i)) god = 40;
	    xx[i] += s[i];
	    yy[i] += d[i];
	} else if(Num[i] == 9) {
	    if(Beat(i)) { Num[i] = 0; WriteBomb(++bomb); }
	    yy[i]++;
	} else if(Num[i] == 10) {
	    if(Beat(i) && power < 11) {
		Num[i] = 0;
		power = (power += 4) > 10? 10: power;
		ShowPow();
	    }
	    yy[i]++;
	} else if(In((int)Num[i],11,13)) {
	    if((Hit(i) && d[i]) || d[i] < 0) {
		shoot = 0; if(!s[i]) {
		    s[i] = 40; if(!(d[i]-=d[i]>0?1:d[i])) k = 500; } }
	    if(((s[i]-=(s[i]!=0))&3)==1) PutPln(xx[i], yy[i], pptr[Num[i]-1]);
	    else PutSpr(xx[i], yy[i], pptr[Num[i]-1]);
	    if(!d[i]) { if(--k<100) yy[i]++; }
	    else { if(!god && Beat(i)) god = 40;
		switch(Num[i]) {
		case 12: if(xx[i]>(XMAX-51)) k = 0;
			 else if(xx[i]<XMIN) k = 1;
			 if(k) xx[i]++; else xx[i]--;
			 break;
		case 13: if(xx[i]>(XMAX-54)) { k = 1; xx[i]-=2; }
			 else if(yy[i]>(YMAX-79)) { k = 2; yy[i]-=2; }
			 else if(xx[i]<XMIN) { k = 3; xx[i]+=3; }
			 else if(yy[i]<YMIN) { k = 0; yy[i]+=2; }
			 xx[i] += !k? 2: k==2? -3: 0;
			 yy[i] += k==1? 2: k==3? -2: 0;
		}
	    }
	} else if(Num[i] == 14) {
	    if(--s[i]) PutSpr(xx[i],yy[i]-=2,pptr[s[i]>30?13:s[i]>10?14:15]);
	    else { Num[i] = 0; continue; }
	} else if(Num[i] < 6 && !Hit(i) && !(hurt=Beat(i))) {
	    switch(Num[i]) {
	    case 1: yy[i] += 4;
		    break;
	    case 2: xx[i] += yy[i] > d[i]? -s[i]: s[i];
		    yy[i] += 3;
                    break;
	    case 3: if(!s[i] && yy[i] > y + d[i]) s[i] = xx[i] > x? -2: 2;
		    xx[i] += s[i];
		    yy[i] += (!s[i]) + 1;
		    break;
	    case 5: if(!random(20)) {
			d[i] = ((y>yy[i])-(y<yy[i])) << 1;
			s[i] = d[i] == 2? 0: ((x>xx[i])-(x<xx[i])) << 1;
			if(s[i] && d[i] == -2) d[i] = -1;
		    }
	    default:xx[i] += s[i];
		    yy[i] += d[i];
	    }
	} else {
	    WriteScore(Score += ss[Num[i]-1]);
	    if(!god && hurt) god = 40;
	    Num[i] = Num[i] == 4? 0: -10;
	    shoot = 0;
	}
      } else if(Num[i] < 0 ) {
	yy[i] += 3;
	if(Num[i] < -4) PutSpr(xx[i], yy[i], pptr[13]);
	else if(Num[i] < -2) PutSpr(xx[i] + 2, yy[i], pptr[14]);
	else PutSpr(xx[i] + 4, yy[i], pptr[15]);
	Num[i]++;
      }
    }
    if(!count--) {
        for(i = 0; i < 20; i++)
	    if(!Num[i]) {
		Num[i] = Num[0] >= 11? (yy[0]<240?(d[0]? 8:14):0): *mptr++;
		if(state==2) switch(Num[i]) {
		    case 1: Num[i] = 2; break;
		    case 2: Num[i] = 3; break;
		    case 3: Num[i] = 7; break;
		    case 11:Num[i] = 12;
		} else if(state==3) switch(Num[i]) {
		    case 1: Num[i] = 3; break;
		    case 2: Num[i] = 7; break;
		    case 3: Num[i] = 5; break;
		    case 11:Num[i] = 13;
		}
		yy[i] = Num[0] >= 11? random(50)+yy[0]: -*(pptr[Num[i] - 1]+1);
		if(Num[i] == 1) /* Killer */
		    xx[i] = random(XMAX - 24);
		else if(Num[i] == 2) { /* Warper */
		    xx[i] = random(XMAX - 20);
		    s[i] = xx[i] < (XMAX - 10) >> 1? 2: -2;
		    d[i] = random(190) + 30;
		} else if(Num[i] == 3) { /* Bird */
		    xx[i] = random(XMAX - 21);
		    s[i] = 0;
		    d[i] = random(100) - 80;
		} else if(Num[i] == 4) { /* Ring */
		    count = 20; Num[i] = 0;
		} else if(Num[i] == 5) { /* Slam */
		    xx[i] = random(XMAX - 24);
		    s[i] = 0;
		    d[i] = 2;
		} else if(Num[i] == 6) { /* Stone */
		    xx[i] = random(XMAX - 15);
		} else if(Num[i] == 7) { /* Head */
		    xx[i] = random(XMAX - 18);
		    s[i] = 2;
                }
		else if(Num[i] == 8) { /* Fire */
		    xx[i] = random(*pptr[Num[0]-1])+xx[0];
		    s[i] = abs(x-xx[i]); d[i] = abs(y-yy[i]);
		    if(s[i]>>1 == d[i]>>1) s[i]=random(3)+1;
		    else if(s[i] > d[i])
			if(s[i] > d[i]<<2) s[i]=random(3)+2;
			else s[i]=random(4)+1;
		    else if(d[i] > s[i]<<2) s[i]=random(2);
			else s[i]=random(3);
		    d[i] = 4 - s[i];
		    if((random(2)&&s[i]<2)||(s[i]>1&&x<xx[i])) s[i] = -s[i];
		    if(y<yy[i]) d[i] = -d[i];
		} else if(Num[i] == 9 || Num[i] == 10) /* ItemB,ItemP */
		    xx[i] = random(XMAX - 17);
		else if(In((int)Num[i],11,13)) { /* Boss1,Boss2,Boss3 */
		    for(j=0;j<20;j++) if(Num[j] && i!=j) break;
		    if(j<20) { Num[i] = 0; mptr--; break; }
		    if(i) { Num[0] = Num[i]; Num[i] = 0; }
		    xx[0] = 90;
		    yy[0] = 10;
		    s[0] = 0;
		    d[0] = 60;
		    k = 0;
		} else if(Num[i] == 14) { /* Boom1,Boom2,Boom3 */
		    xx[i] = random(*pptr[Num[0]-1]+10)+xx[0]-15;
		    yy[i] = random(*(pptr[Num[0]-1]+1)+10)+yy[0]-15;
		    s[i] = 60;
		}
		break;
	    }
	count=i==20?0:random(Num[i]==7?70:Num[i]==6||In((int)Num[0],11,13)?20:50);
    }
    return(0);
}
void Toom(void)
{   /* bomb enermy */
    int i = 0;
    if(!DifKey(56) || bomb == 0) return;
    if(In((int)Num[0],11,13)) { if(d[0]<=0) return;
	i++; shoot = 0; d[0] -= d[0] == 8? 9: 8; s[0] = 40; }
    else count = 200;
    WriteBomb(--bomb);
    for(;i<20;i++) {
	if(Num[i]>0) Score += ss[Num[i]-1];
	if(Num[i]==4 || Num[i]==8) Num[i] = 0;
	else if(Num[i]>0 && Num[i] != 6 && Num[i] != 9 && Num[i] != 10)
	    Num[i] = -10;
    }
    WriteScore(Score);
}
void PutRocket()
{   /* draw my rocket */
    static int k = 0; /* variable for swap rocket picture */
    static int m = 0; /* variable for start rocket */
    static int b = 100; /* boom */
    if(god == 200) { m = 70; power = 11; ShowPow();}
    if((power<0 || y>212) && !m) {
	power = -1;
	PutSpr(x+random(30)-10,y+random(30)-10,pptr[13]);
	if(!--b) { b = 100; god = 201; WriteLife(--life); }
    } else {
	xold = x; yold = y;
	if(m -= (m!=0)) { x = 110; y = m*2+100; }
	else {
	    _BX = RIGHT_KEY - LEFT_KEY;
	    x += (_BX << 1) + _BX;
	    _BX = DOWN_KEY - UP_KEY;
	    y += (_BX << 1) + _BX;
	    if(Out(x,0,233)) x = xold;
	    if(Out(y,0,212)) y = yold;
	}
	if((god & 3) == 1) { if(k & 4) PutPln(x, y, Rocket1); else PutPln(x, y, Rocket2); }
	else if(k & 4) PutSpr(x, y, Rocket1); else PutSpr(x, y, Rocket2);
    }
    if(god == 40) { power--; ShowPow(); }
    if(god) god--;
    k++;
}
void ClrScreen()
{   /* clear screen only sprite position */
    int i;
    for(i = 0; i < NClr[p]; i++)
	ClrSprite(x0[p][i], y0[p][i], ptr0[p][i]);
    NClr[p] = 0;
}
void BootStart()
{
    int i;
    BYTE *a[] = {
    SPRITE3,SPRITE4,SPRITE5,SPRITE6,
    SPRITE7,SPRITE8,SPRITE9,SPRITE10,
    SPRITE11,SPRITE12,SPRITE13,SPRITE14,
    SPRITE15,SPRITE16,SPRITE17,SPRITE18};
    SetModeX();
    SetPage(1,0);
    SetPalette(0,255,Palette);
    Rocket1 = SPRITE0;
    Rocket2 = SPRITE1;
    MyGun = SPRITE2;
    for(i = 0; i < 16; i++)
	pptr[i] = a[i];
    SetPaper(0,0,259,239);
    for(i=0;i<240;i++) PutStar(); /* dummy for random star */
    ClrScrn(0);
    randomize();
    LAST_KEY = 0;
}
void Bar2(int x0, int y0, int x1, int y1)
{   /* clear window page 0,1 with color 0 */
    int i = PageStart == FirstAdr[0]? 0: 1;
    Bar(x0,y0,x1,y1,0);
    CopyPot(x0>>2,y0,x1>>2,y1,i,x0>>2,y0,1-i);
}
void InitState()
{
    mptr = map;
    count = 200;
    SetPage(0,1);
    XMAX = 359;
    Bar(260,0,359,239,18);
    PrintfCU(290,10,75,1,"ฉาก");
    PutNumber(80, 18, 41, 18, state==0?1:state==4?3:state, 1);
    PrintfCU(290,30,75,1,"คะแนน");
    WriteScore(Score);
    PrintfCU(270,70,75,1,"ระเบิด:");
    WriteBomb(bomb);
    PrintfCU(280,110,75,1,"พลังงาน");
    power = 10;
    ShowPow();
    PutSprite(280,170,Rocket1);
    PrintfCU(310,170,75,1,"x");
    WriteLife(life);
    Bar2(50,90,180,110);
    CopyPot(65,0,89,239,1,65,0,0);
    XMAX = 259;
}
BYTE PassGame()
{   /* state clear return 1 when ready */
    static k = 200;
    if(--k) {
	PrintfCU(50,90,76,1,"เย้! ผ่านฉาก %d แล้ว",state);
	return(0);
    } else {
	k = 200;
	state++;
	life++;
	Num[0] = 0;
	return(1);
    }
}
main()
{
    int ff;
    BootStart();
    while(!ESC_KEY) {
	InitState();
	ff = 200;
	while(!ESC_KEY) {
	    SetPage(p=1-p,p);
	    ClrScreen();
	    PutStar();
	    if(ff && In(state,1,3)) {
		if(--ff)
		    PrintfCU(48,70,76,1,"ฉาก %d สู้ตายเพื่อท่านปึ๋ย!",state);
		else {
		    Bar2(48,70,196,90);
		}
	    }
	    if(!state) {
		PrintfCU(40,70,76,1,"CTRL:ยิง ALT:ระเบิด ESC:ออก");
		PrintfCU(40,150,76,1,"กดอะไรก็ได้เพื่อเริ่มเกมส์");
		if(LAST_KEY) {
		    Bar2(40,150,200,170);
		    Bar2(40,70,240,90);
		    state++;
		}
	    } else if(state>3) {
		PrintfCU(30,90,76,1,"ดูเด่ะ เล่นมาตั้งนาน จบเฉยเลย");
		PrintfCU(20,120,76,1,"โปรแกรมโดย เชษฐา เจนจิโรจพิพัฒน์");
	    } else if(PutEnermy()) if(PassGame()) break;
	    if(life) { PutRocket(); Gun(); Toom(); }
	    else {
		y = 240;
		PrintfCU(30,100,76,1,"นักรบพลีชีพหมดแล้ว ท่านปึ๋ยจงเจริญ!");
		PrintfCU(20,130,76,1,"โปรแกรมโดย เชษฐา เจนจิโรจพิพัฒน์");
            }
	}
    }
    CloseX();
}