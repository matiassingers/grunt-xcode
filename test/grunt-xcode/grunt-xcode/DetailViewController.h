//
//  DetailViewController.h
//  grunt-xcode
//
//  Created by Matias Singers on 07/10/14.
//  Copyright (c) 2014 Matias Singers. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DetailViewController : UIViewController

@property (strong, nonatomic) id detailItem;
@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;

@end

