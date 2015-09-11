<?php
/*
Plugin Name: GovRight Corpus Tools
Plugin URI: http://govright.org
Description: 
Version: 0.1
Author: Heath Morrison
Author URI: http://www.govright.org
*/

add_action( 'wp_enqueue_scripts', 'corpus_add_script' ); 

// Disable bullshit from Wordpress.
remove_filter( 'the_content' , 'wptexturize' );

add_shortcode("corpus-template", "corpus_template_handler");
add_shortcode("corpus-discussions", "corpus_discussions_handler");
add_shortcode("corpus-discussion", "corpus_discussion_handler");
add_shortcode("corpus-recent-comments", "corpus_recent_comments_handler");
add_shortcode("corpus-articles", "corpus_articles_handler");

function corpus_add_script() {
    wp_register_script('corpus_widgets', 'http://corpus.govright.org/widgets/dist/widgets.min.js', array('jquery'), '1.0', true);
    wp_enqueue_script('corpus_widgets');
}

function make_tag($tag, $atts, $contents) {
    $attributes = "";
    foreach ($atts as $key => $val) {
        $attributes .= $key.'="'. $val . '" ';
    }
    #$contents = html_entity_decode($contents);
    return "<$tag $attributes>$contents</$tag>";
}

function corpus_template_handler($atts, $contents) {
    if (!isset($atts['type'])) {
       $atts['type'] = 'html/template';
    }
    if (!isset($atts['class'])) {
        $atts['class'] = 'corpus-template';
    }

    return make_tag('script', $atts, $contents);
}

function corpus_discussions_handler($atts, $contents) {
    return make_tag('corpus-discussions', $atts, $contents);
}

function corpus_discussion_handler($atts, $contents) {
    return make_tag('corpus-discussion', $atts, $contents);
}

function corpus_recent_comments_handler($atts, $contents) {
    return make_tag('corpus-recent-comments', $atts, $contents);
}

function corpus_articles_handler($atts, $contents) {
  return make_tag('corpus-articles', $atts, $contents);
}
