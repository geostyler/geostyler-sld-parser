<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Styled Label</se:Name>
    <UserStyle>
      <se:Name>Styled Label</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Rule 1</se:Name>
          <se:TextSymbolizer>
            <se:Label>
              <ogc:Literal>Your Label</ogc:Literal>
            </se:Label>
            <se:Font>
              <se:SvgParameter name="font-size">12</se:SvgParameter>
            </se:Font>
            <se:Fill>
              <se:SvgParameter name="fill">#2476ad</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">1</se:SvgParameter>
            </se:Fill>
          </se:TextSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
