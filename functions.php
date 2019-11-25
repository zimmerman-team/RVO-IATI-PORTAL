<?php

require_once( 'library/bones.php' );

// CUSTOMIZE THE WORDPRESS ADMIN (off by default)
require_once( 'library/admin.php' );

/*********************
LAUNCH BONES
Let's get everything up and running.
*********************/

function openaid_init() {

  add_theme_support( 'angular-wp-api',
    array(
      'oipa'
    ));

  //Allow editor style.
  add_editor_style( get_stylesheet_directory_uri() . '/library/css/editor-style.css' );

  // let's get language support going, if you need it
  //load_theme_textdomain( 'bonestheme', get_template_directory() . '/library/translation' );

  // USE THIS TEMPLATE TO CREATE CUSTOM POST TYPES EASILY
  //require_once( 'library/custom-post-type.php' );

  // launching operation cleanup
  add_action( 'init', 'bones_head_cleanup' );
  // remove WP version from RSS
  add_filter( 'the_generator', 'bones_rss_version' );
  // remove pesky injected css for recent comments widget
  add_filter( 'wp_head', 'bones_remove_wp_widget_recent_comments_style', 1 );
  // clean up comment styles in the head
  add_action( 'wp_head', 'bones_remove_recent_comments_style', 1 );
  // clean up gallery output in wp
  add_filter( 'gallery_style', 'bones_gallery_style' );

  // enqueue base scripts and styles
  add_action( 'wp_enqueue_scripts', 'bones_scripts_and_styles', 999 );
  // ie conditional wrapper

  // launching this stuff after theme setup
  bones_theme_support();

  // adding sidebars to Wordpress (these are created in functions.php)
  //add_action( 'widgets_init', 'bones_register_sidebars' );

  // cleaning up random code around images
  add_filter( 'the_content', 'bones_filter_ptags_on_images' );
  // cleaning up excerpt
  add_filter( 'excerpt_more', 'bones_excerpt_more' );

} /* end bones ahoy */

// let's get this party started
add_action( 'after_setup_theme', 'openaid_init' );


/************* OEMBED SIZE OPTIONS *************/

if ( ! isset( $content_width ) ) {
	$content_width = 640;
}

/************* THUMBNAIL SIZE OPTIONS *************/

// Thumbnail sizes
add_image_size( 'custom-size', 745, 300, true );


add_filter( 'image_size_names_choose', 'bones_custom_image_sizes' );

function bones_custom_image_sizes( $sizes ) {
    return array_merge( $sizes, array(
        'bones-thumb-600' => __('600px by 150px'),
        'bones-thumb-300' => __('300px by 100px'),
    ) );
}


function add_rewrite_rules( $wp_rewrite )
{
  $new_rules = array(
    'programmes/([^/]+)/?$' => 'index.php?pagename=programme&iati_id='.$wp_rewrite->preg_index(1),
    'projects/([^/]+)/?$' => 'index.php?pagename=project&iati_id='.$wp_rewrite->preg_index(1),
    'countries/([^/]+)/?$' => 'index.php?pagename=country&country_id='.$wp_rewrite->preg_index(1),
    'organisations/([^/]+)/?$' => 'index.php?pagename=organisation&donor_id='.$wp_rewrite->preg_index(1),
    'sectors/([^/]+)/?$' => 'index.php?pagename=sector&donor_id='.$wp_rewrite->preg_index(1),
    'embed/([^/]+)/?$' => 'index.php?pagename=embed&iati_id='.$wp_rewrite->preg_index(1),
  );
  $wp_rewrite->rules = $new_rules + $wp_rewrite->rules;
}
add_action('generate_rewrite_rules', 'add_rewrite_rules');




add_action( 'wp_ajax_nopriv_dateupdated', 'dateupdated' );
add_action( 'wp_ajax_dateupdated', 'dateupdated' );

function dateupdated() {

  $json = file_get_contents('https://iatiregistry.org/api/3/action/package_show?id=rvo-01');
  $obj = json_decode($json, true);
  $extras = $obj['result']['extras'];
  $date_updated = '2019-11-19 12:00';

  for ($i = 0; $i < count($extras); $i++){
    if ($extras[$i]['key'] == 'data_updated'){
      $date_updated = $extras[$i]['value'];
      break;
    }
  }

  $response = json_encode( array( 'date_updated' => $date_updated ) );

  header( "Content-Type: application/json" );
  echo $response;
  exit;
}
