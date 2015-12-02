<!doctype html>

<!--[if lt IE 7]><html lang="nl" class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if (IE 7)&!(IEMobile)]><html lang="nl" class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if (IE 8)&!(IEMobile)]><html lang="nl" class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--> <html lang="nl" class="no-js"><!--<![endif]-->

	<head>
		<meta charset="utf-8">

		<?php // force Internet Explorer to use the latest rendering engine available ?>
		<meta http-equiv="X-UA-Compatible" content="IE=edge">

		<title>Home | PoC Netherlands Enterprise Agency</title>

		<?php // mobile meta (hooray!) ?>
		<meta name="HandheldFriendly" content="True">
		<meta name="MobileOptimized" content="320">
		<meta name="viewport" content="width=device-width, initial-scale=1"/>

		<?php // icons & favicons (for more: http://www.jonathantneal.com/blog/understand-the-favicon/) ?>
		<link rel="apple-touch-icon" href="<?php echo get_template_directory_uri(); ?>/library/images/apple-touch-icon.png">
		<link rel="shortcut icon" href="http://english.rvo.nl/sites/all/themes/custom/agnl_theme/favicon.ico" type="image/vnd.microsoft.icon">
		<!--[if IE]>
			<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico">
		<![endif]-->
		<?php // or, set /favicon.ico for IE10 win ?>
		<meta name="msapplication-TileColor" content="#f01d4f">
		<meta name="msapplication-TileImage" content="<?php echo get_template_directory_uri(); ?>/library/images/win8-tile-icon.png">
            <meta name="theme-color" content="#121212">

		<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

		
		<?php // wordpress head functions ?>
		<?php wp_head(); ?>
		<?php // end of wordpress head ?>
		<base href="<?php echo home_url() . '/'; ?>" />
		<script>
			var home_url = '<?php echo home_url(); ?>';
			var template_url = '<?php echo get_template_directory_uri(); ?>';
			var oipa_url = 'http://localhost:8000/api';
			var reporting_organisation_id = 'NL-KVK-27378529';
			<?php $customFields = get_post_custom(); ?>
			var customFields = <?php echo json_encode($customFields); ?>;
		</script>
	</head>

	<body <?php body_class(); ?> itemscope itemtype="http://schema.org/WebPage" ng-app="oipa">

<div class="container page-wrap">


