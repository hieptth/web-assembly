#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <emscripten.h>


typedef void logProgress(double progress);

int accumulate(unsigned* arr, int n) {
    int sum = 0;
    for (unsigned i = 0; i < n; i++) {
        sum += *(arr + i);
    }
    return sum;
}

unsigned char* randString(int len, logProgress* log) {
    unsigned char* str = (unsigned char*)malloc(len + 1);

    srand(time(NULL));

    for (int i = 0; i < len; i++) {
        // generate a printable character between 33 and 126
        str[i] = rand() % (127 - 33) + 33;
        log(((double)i + 1) / (double)len);

        // sleep for 1 second
        sleep(1);
    }
    str[len] = '\0';
    return str;
}

char* getString() {
    return "Hello World!";
}

int main() {
    return 0;
}