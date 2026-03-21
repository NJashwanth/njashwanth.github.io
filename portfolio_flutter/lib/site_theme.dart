import 'package:flutter/material.dart';

class SiteTheme {
  // Light theme colors
  static const Color lightBackground = Color(0xFFF4F2EE); // --bg
  static const Color lightSurface = Color(0xFFFFFDF9); // --surface
  static const Color lightInk = Color(0xFF223037); // --ink
  static const Color lightAccent = Color(0xFF4F6B61); // --accent

  // Dark theme colors
  static const Color darkBackground = Color(0xFF181D1F); // --bg (dark)
  static const Color darkSurface = Color(0xFF20282B); // --surface (dark)
  static const Color darkInk = Color(0xFFE6ECE9); // --ink (dark)
  static const Color darkAccent = Color(0xFF9EC0B2); // --accent (dark)

  static ThemeData light = ThemeData(
    fontFamily: 'Work Sans',
    scaffoldBackgroundColor: lightBackground,
    colorScheme: ColorScheme.light(
      background: lightBackground,
      surface: lightSurface,
      primary: lightAccent,
      onPrimary: lightInk,
      secondary: lightAccent,
      onSecondary: lightInk,
      onBackground: lightInk,
      onSurface: lightInk,
    ),
    textTheme: const TextTheme(
      bodyMedium: TextStyle(
        color: lightInk,
        fontSize: 22,
        fontWeight: FontWeight.w500,
      ),
    ),
  );

  static ThemeData dark = ThemeData(
    fontFamily: 'Work Sans',
    scaffoldBackgroundColor: darkBackground,
    colorScheme: ColorScheme.dark(
      background: darkBackground,
      surface: darkSurface,
      primary: darkAccent,
      onPrimary: darkInk,
      secondary: darkAccent,
      onSecondary: darkInk,
      onBackground: darkInk,
      onSurface: darkInk,
    ),
    textTheme: const TextTheme(
      bodyMedium: TextStyle(
        color: darkInk,
        fontSize: 22,
        fontWeight: FontWeight.w500,
      ),
    ),
  );
}
