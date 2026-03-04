/* --- XGRAPH.C ---*/
#pragma inline
#include <stdio.h>
#include <conio.h>
#include <dos.h>
#include <math.h>
#include <stdlib.h>
#include <stdarg.h>
#include <string.h>
#include "cunormal.cpp"
typedef unsigned char BYTE;
char far *PageStart, far *FirstAdr[3];
unsigned int LINE_Y[240], POT_X[360];
unsigned short page_offset[3];
int HELP_VAR;
int XMIN = 0, YMIN = 0, XMAX = 359, YMAX = 239;
int X_OLD = 0, Y_OLD = 0;
int Y_OFFSET = 90;
template <class T> inline void XChg(T a, T b) { T c = a; a = b; b = c; };
template <class T> inline int In(T a, T b, T c) { return a >= b && a <= c; };
template <class T> inline int Out(T a, T b, T c) { return a < b || a > c; };
template <class T> inline int Sgn(T a) { return (a > 0) - (a < 0); };
//#define XChg(a,b) asm { mov ax,a; xchg ax,b; mov a,ax; }
//#define In(a,b,c) ((HELP_VAR = (a)) >= (b) && HELP_VAR <= (c))
//#define Out(a,b,c) ((HELP_VAR = (a)) < (b) || HELP_VAR > (c))
//#define Sgn(a) (((HELP_VAR = (a)) > 0) - (HELP_VAR < 0))
void SetDisplayPage(unsigned int page);
/***********************************************************************
 vaiable and function for keyboard
 ***********************************************************************/
BYTE LAST_KEY = 0, KEY[128]; /* for keyboard table */
void interrupt (*OldKeyVec)(...);
void interrupt NewKeyInt(...)
{   /* set KEY variable when keyboard interrupt */
    BYTE ch;
    ch = inp(0x60);
    if(ch) LAST_KEY = ch; else return;
    ch = inp(0x61);
    outp(0x61, (ch | 0x80)); outp(0x61, ch); outp(0x20, 0x20);
    if(LAST_KEY < 128) KEY[LAST_KEY] |= 1; else KEY[LAST_KEY & 127] &= 2;
}
#define RIGHT_KEY KEY[77]
#define LEFT_KEY  KEY[75]
#define UP_KEY    KEY[72]
#define DOWN_KEY  KEY[80]
#define BAR_KEY   KEY[57]
#define ESC_KEY   KEY[1]
#define SHIFT_KEY (KEY[42]|KEY[54])
#define KeyBufferMode() setvect(9, OldKeyVec)
    /* set keyboard buffer mode */
void ScanCodeMode()
{   /* set scancode mode */
    memset(KEY, 0, 128);
    setvect(9, NewKeyInt);
}
#define ClrBuffer() memset(KEY, 0, 128)
BYTE DifKey(int i)
{   /* dif edge when press key */
    if(KEY[i] == 1) {
	KEY[i] = 3;
	return(1);
    } else {
	KEY[i] = !(KEY[i] & 1)? 0: 3;
	return(0);
    }
}
/***********************************************************************
 function for set screen
 ***********************************************************************/
void SetModeX(void)
{   /* set mode X 360x240 , 256 color , 3 page */
    unsigned int i, XReg[] = {    0x3d4,0x6b00, 0x3d4,0x5901,
      0x3d4,0x5a02, 0x3d4,0x8e03, 0x3d4,0x5e04, 0x3d4,0x8a05,
      0x3d4,0x0d06, 0x3d4,0x3e07, 0x3d4,0x0008, 0x3d4,0x4109,
      0x3d4,0xea10, 0x3d4,0xac11, 0x3d4,0xdf12, 0x3d4,0x2d13,
      0x3d4,0x0014, 0x3d4,0xe715, 0x3d4,0x0616, 0x3d4,0xe317,
      0x3c4,0x0101, 0x3c4,0x0604, 0x3ce,0x4005, 0x3ce,0x0506 };
    _AX = 0x13;
    geninterrupt(0x10);
    outp(0x3d4, 17);
    outp(0x3d5, (inp(0x3d5) & 127));
    outp(0x3c2, 231);
    for(i = 0; i < 44; i += 2) /* set vga register mode X */
	outport(XReg[i], XReg[i+1]);
    inp(0x3da);
    outp(0x3c0, 0x30);
    outp(0x3c0, 0x41);
    PageStart = (char *)MK_FP(0xa000, 0);
    for(i = 0; i < 0xffff; i++) *(PageStart + i) = 0;
    for(i = 0; i < 3; i++)
	FirstAdr[i] = PageStart + (page_offset[i] = 21600 * i);
    for(i = 0; i < 240; i++) LINE_Y[i] = i * Y_OFFSET;
    for(i = 0; i < 360; i++) POT_X[i] = (256 << (i & 3)) | 2;
    OldKeyVec = getvect(9);
    ScanCodeMode();
    SetDisplayPage(0);
    inp(0x3da);
    outp(0x3c0, 0x33);
    outp(0x3c0, 0);
}
void CloseX()
{
    unsigned *ptr;

    ptr = (unsigned *)0x417;
    *ptr &= 0xf0;
    setvect(9, OldKeyVec);
    textmode(C80);
}
/* close mode X and goto text mode */
void SetPaper(int x0, int y0, int x1, int y1)
{   /* set frame for draw */
    if(x0 > x1) XChg(x0, x1);
    if(y0 > y1) XChg(y0, y1);
    XMIN = x0;
    YMIN = y0;
    XMAX = x1;
    YMAX = y1;
}
#define PAPER XMIN,YMIN,XMAX,YMAX
    /* parameter of paper */
#define RESTORE 0,0,359,239
    /* maximum parameter */
#define SetActivePage(page) PageStart = FirstAdr[page]
    /* set page for drawing */
void SetDisplayPage(unsigned int page)
{   /* set page for show */
    outport(0x3D4, 0x0C | (page_offset[page] & 0xFF00));
    outport(0x3D4, 0x0D | (page_offset[page] << 8));
    _DX = 0x3da;
    while (inp(_DX) & 8); /* wait VSync loop */
    while (!(inp(_DX) & 8));
}
#define SetPage(d,a) { SetActivePage(a); SetDisplayPage(d); }
    /* set page for show and page for drawing */
/***********************************************************************
 function for color
 ***********************************************************************/
void SetPalette(int start, int end, BYTE far *ptr)
{   /* set color number start - number end by array */
    outp(0x3c8, start);
    for(start = 3 * (end - start + 1); start; start--)
	outp(0x3c9, *ptr++);
}
/***********************************************************************
 function for drawing
 ***********************************************************************/
void ClrScrn(BYTE color)
{   /* clear screen with color */
    asm {
	MOV     AX,0f02H
	MOV	DX,3c4H
	OUT	DX,AX
	CLD
	LES     DI,PageStart
	MOV     CX,10800
	MOV     AL,color
	MOV	AH,AL
	REP     STOSW
    }
}
void PutPixel(int x, int y, BYTE color)
{   /* put pixel */
    if(Out(x, XMIN, XMAX) || Out(y, YMIN, YMAX)) return;
    outport(0x3c4, POT_X[x]);
    *(PageStart + LINE_Y[y] + (x >> 2)) = color;
}
void Bar(int x0, int y0, int x1, int y1, BYTE color)
{   /* color bar */
    int p[3], pot[3] = { 0, 0, 0 }, i;
    BYTE far *ptr1, far *ptr2;
    if(x0 > x1) XChg(x0, x1);
    if(x0 < XMIN) if(x1 < XMIN) return; else x0 = XMIN;
    if(x1 > XMAX) if(x0 > XMAX) return; else x1 = XMAX;
    if(y0 > y1) XChg(y0, y1);
    if(y0 < YMIN) if(y1 < YMIN) return; else y0 = YMIN;
    if(y1 > YMAX) if(y0 > YMAX) return; else y1 = YMAX;
    i = x0; do pot[0] |= POT_X[i]; while(POT_X[i++] != 0x802);
    i = x1; do pot[2] |= POT_X[i]; while(POT_X[i--] != 0x102);
    if((p[1] = p[0] = x0 >> 2) == (p[2] = x1 >> 2)) {
	pot[0] &= pot[2];
	pot[2] = 0;
    } else if(p[2] > ++p[1]) {
	if(pot[0] == (pot[1] = 0xf02)) { pot[0] = 0; p[1]--; }
	if(pot[2] == 0xf02) { pot[2] = 0; p[2]++; }
    }
    ptr1 = PageStart + LINE_Y[y0] + p[0];
    for(i = 0; i < 3; i++) if(pot[i]) {
	outport(0x3c4, pot[i]);
	do { asm push word ptr y0;
	    for(ptr2 = ptr1++; y0 <= y1; y0++, ptr2 += Y_OFFSET)
		*ptr2 = color;
	    asm pop word ptr y0;
	} while(i == 1 && ++p[1] < p[2]);
    }
}
void CopyPot(int p1, int y1, int p2, int y2, int ps, int p3, int y3, int pd)
{   /* copy POT(x << 2) of (p1,y1)-(p2,y2) from page ps to (p3,y3) page pd */
    char far *ptr0, far *ptr1;
    if(p3 >= Y_OFFSET || y3 > 239) return;
    p2 -= p1 - 1;
    y2 -= y1;
    if(p3 < 0) { p2 += p3; p3 = 0; }
    if(y3 < 0) { y2 += y3; y3 = 0; }
    if(p2 <= 0 || y2 < 0) return;
    if(p2 + p3 > Y_OFFSET) p2 = Y_OFFSET - p3;
    if((y2 += y3) > 239) y2 = 239;
    outport(0x3ce, 0x4105);
    outport(0x3c4, 0x0f02);
    ptr0 = FirstAdr[pd] + y3 * Y_OFFSET + p3;
    ptr1 = FirstAdr[ps] + y1 * Y_OFFSET + p1;
    asm CLD;
    for(; y3 <= y2; y3++, ptr0 += Y_OFFSET, ptr1 += Y_OFFSET) {
	asm {
	    PUSH    DS
	    LDS     SI,ptr1
	    LES     DI,ptr0
	    MOV     CX,p2
	    REP     MOVSB
	    POP     DS
	}
    }
    outport(0x3ce, 0x4005);
}
/***********************************************************************
 Function for SPRITE  type of ARRAY is BYTE
 format MEM MONO  : pattern data
 format SPRITE    : Num of X, Num of Y, color data ( X x Y pixel )
 Remark---if color data = 0 then null color
 ***********************************************************************/
void PutMemMono(int x, int y, BYTE c, BYTE far *ptr, int bytex, int sizey)
{   /* put mem image mono color sprite to active page */
    BYTE d;
    for(; sizey > 0; sizey--, y++) {
	asm { push word ptr x; push word ptr bytex; }
	for(; bytex > 0; bytex--, x += 8) {
	    asm push word ptr x;
	    for(d = *ptr++; d != 0; d += d, x++)
		if(d & 128) PutPixel(x, y, c);
	    asm pop word ptr x;
	}
	asm { pop word ptr bytex; pop word ptr x; }
    }
}
void PutSprite(int x0, int y0, BYTE far *ptr)
{   /* put image sprite to active page */
    int sizex = *ptr++ + x0, sy = *ptr, sizey = sy + y0;
    BYTE far *A, far *B = PageStart + y0 * Y_OFFSET;
    for(; x0 < sizex; x0++) {
	if(In(x0, XMIN, XMAX)) {
            A = B + (x0 >> 2);
	    asm push word ptr y0;
	    outport(0x3c4, POT_X[x0]);
	    for(; y0 < sizey; y0++, A += Y_OFFSET)
		if(*(++ptr) && In(y0, YMIN, YMAX)) *A = *ptr;
	    asm pop word ptr y0;
	} else ptr += sy;
    }
}
/***********************************************************************
 Function for TEXT
 ***********************************************************************/
int PutBigCU(int x, int y, BYTE color, int mul, unsigned int ch)
{   /* put big CU character on screen */
//    extern char CU_font[4480];
    char far *ptr = CU_font + (ch - 32) * 20;
    PutMemMono(x, y, color, ptr, 1, 20);
    return 1;
}
void PrintfCU(int x, int y, BYTE color, int mul, BYTE far *str, ...)
{   /* print text thai by CU font */
    va_list argptr;
    BYTE far *ptr = (BYTE *)malloc(500), ch;
    static BYTE st[17] = "ÓÔÕÖ×íÑØÙÚçèéêëì";
    unsigned int mul8 = mul << 3, i;
    va_start(argptr, str);
    vsprintf(ptr, str, argptr);
    va_end(argptr);
    for(str = ptr; ch = *str++;) {
	if(ch > 32) {
	    if(ch == 211) {
		PutBigCU(x - mul8, y, color, mul, 237);
		ch--;
	    }
	    x -= mul8 & -(strchr(st, ch) > st);
	    asm { push word ptr y; push word ptr x; }
	    i = strchr(st, *(str - 2)) - st;
	    x -= mul8 & -(In((int)ch, 231, 236) && !i);
	    y += (mul8 >> 1) & -(i > 6 && In((int)ch, 231, 236));
	    PutBigCU(x, y, color, mul, ch);
	    asm { pop word ptr x; pop word ptr y; }
	}
	x += mul8;
    }
    free(ptr);
}